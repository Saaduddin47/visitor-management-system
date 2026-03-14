import express from 'express';
import { AUDIT_ACTIONS, REQUEST_STATUS, ROLES } from '@vms/shared/src/index.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { VisitorRequest } from '../models/VisitorRequest.js';
import { AppError } from '../utils/AppError.js';
import { requiredString } from '../utils/validators.js';
import { writeAuditLog } from '../services/auditService.js';
import { sendMail } from '../config/mailer.js';

const router = express.Router();

const sendVisitorStatusMail = async ({ request, statusLabel, frontDeskRemark }) => {
  if (!request.visitorEmail) return;

  try {
    await sendMail({
      to: request.visitorEmail,
      subject: `Visit ${statusLabel} (${request.referenceId})`,
      html: `<div style="font-family: Inter, Arial, sans-serif; color: #0f172a;">
        <h2>Visitor status updated: ${statusLabel}</h2>
        <p><strong>Reference:</strong> ${request.referenceId}</p>
        <p><strong>Visitor:</strong> ${request.visitorName}</p>
        <p><strong>Date:</strong> ${request.dateOfVisit} at ${request.timeOfVisit}</p>
        ${frontDeskRemark ? `<p><strong>Front desk remark:</strong> ${frontDeskRemark}</p>` : ''}
      </div>`
    });
  } catch (emailErr) {
    console.error(`[frontdesk/${statusLabel}] Email sending failed:`, emailErr.message);
  }
};

router.use(protect, authorize(ROLES.FRONT_DESK));

router.get(
  '/today',
  asyncHandler(async (req, res) => {
    const rawOffset = Number(req.query.tzOffsetMinutes);
    const tzOffsetMinutes = Number.isFinite(rawOffset) ? rawOffset : new Date().getTimezoneOffset();

    const now = new Date();
    const clientNow = new Date(now.getTime() - tzOffsetMinutes * 60 * 1000);
    const year = clientNow.getFullYear();
    const month = clientNow.getMonth();
    const day = clientNow.getDate();

    const targetDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const start = new Date(clientNow);
    start.setHours(0, 0, 0, 0);
    const end = new Date(clientNow);
    end.setHours(23, 59, 59, 999);

    const visitors = await VisitorRequest.aggregate([
      {
        $addFields: {
          visitDateParsed: {
            $convert: {
              input: '$dateOfVisit',
              to: 'date',
              onError: null,
              onNull: null
            }
          }
        }
      },
      {
        $match: {
          $or: [
            { visitDateParsed: { $gte: start, $lte: end } },
            { dateOfVisit: targetDateString },
            { dateOfVisit: { $regex: `^${targetDateString}` } }
          ]
        }
      },
      { $sort: { timeOfVisit: 1 } },
      { $project: { visitDateParsed: 0 } }
    ]);

    console.log('[frontdesk/today] query debug', {
      tzOffsetMinutes,
      now,
      targetDateString,
      start,
      end,
      count: visitors.length
    });

    res.json({ visitors });
  })
);

router.post(
  '/scan',
  asyncHandler(async (req, res) => {
    const visitId = requiredString(req.body.visitId, 'Visit ID', 120);
    const request = await VisitorRequest.findOne({ visitId });
    if (!request) throw new AppError('Visit not found', 404);
    res.json({ request });
  })
);

router.post(
  '/manual',
  asyncHandler(async (req, res) => {
    const referenceId = requiredString(req.body.referenceId, 'Reference ID', 120);
    const request = await VisitorRequest.findOne({ referenceId });
    if (!request) throw new AppError('Visit not found', 404);
    res.json({ request });
  })
);

router.post(
  '/requests/:id/check-in',
  asyncHandler(async (req, res) => {
    const request = await VisitorRequest.findById(req.params.id);
    if (!request) throw new AppError('Visit not found', 404);

    request.status = REQUEST_STATUS.CHECKED_IN;
    request.checkedInAt = new Date();
    request.frontDeskRemarks = req.body.remark ? requiredString(req.body.remark, 'Remark', 500) : '';
    request.actions.push({ action: REQUEST_STATUS.CHECKED_IN, user: req.user._id, remark: request.frontDeskRemarks });
    await request.save();

    await writeAuditLog({
      action: AUDIT_ACTIONS.VISITOR_CHECKIN,
      user: req.user._id,
      role: req.user.role,
      resourceType: 'VisitorRequest',
      resourceId: request._id.toString(),
      meta: { referenceId: request.referenceId, remark: request.frontDeskRemarks }
    });

    res.json({ request });
  })
);

router.post(
  '/requests/:id/check-out',
  asyncHandler(async (req, res) => {
    const request = await VisitorRequest.findById(req.params.id);
    if (!request) throw new AppError('Visit not found', 404);

    request.status = REQUEST_STATUS.CHECKED_OUT;
    request.checkedOutAt = new Date();
    request.frontDeskRemarks = req.body.remark ? requiredString(req.body.remark, 'Remark', 500) : '';
    request.actions.push({ action: REQUEST_STATUS.CHECKED_OUT, user: req.user._id, remark: request.frontDeskRemarks });
    await request.save();

    await sendVisitorStatusMail({
      request,
      statusLabel: 'Checked Out',
      frontDeskRemark: request.frontDeskRemarks
    });

    await writeAuditLog({
      action: AUDIT_ACTIONS.VISITOR_CHECKOUT,
      user: req.user._id,
      role: req.user.role,
      resourceType: 'VisitorRequest',
      resourceId: request._id.toString(),
      meta: { referenceId: request.referenceId, remark: request.frontDeskRemarks }
    });

    res.json({ request });
  })
);

router.post(
  '/requests/:id/no-show',
  asyncHandler(async (req, res) => {
    const request = await VisitorRequest.findById(req.params.id);
    if (!request) throw new AppError('Visit not found', 404);

    request.status = REQUEST_STATUS.NO_SHOW;
    request.frontDeskRemarks = req.body.remark ? requiredString(req.body.remark, 'Remark', 500) : '';
    request.actions.push({ action: REQUEST_STATUS.NO_SHOW, user: req.user._id, remark: request.frontDeskRemarks });
    await request.save();

    await sendVisitorStatusMail({
      request,
      statusLabel: 'No Show',
      frontDeskRemark: request.frontDeskRemarks
    });

    await writeAuditLog({
      action: AUDIT_ACTIONS.VISITOR_NO_SHOW,
      user: req.user._id,
      role: req.user.role,
      resourceType: 'VisitorRequest',
      resourceId: request._id.toString(),
      meta: { referenceId: request.referenceId, remark: request.frontDeskRemarks }
    });

    res.json({ request });
  })
);

export default router;
