// Lead controller
const { STATUS } = require('../config/constants');
const { successResponse, getPaginationMeta } = require('../utils/helpers');
const { catchAsync } = require('../middleware/error.middleware');
const leadService = require('../services/lead.service');

/**
 * Submit financing application
 * @route POST /api/v1/leads/financing
 * @access Public
 */
const submitFinancingLead = catchAsync(async (req, res) => {
  const lead = await leadService.createFinancingLead(req.body);

  res.status(STATUS.CREATED).json(
    successResponse(
      { leadId: lead.id },
      'Financing application submitted successfully. Our team will contact you shortly.'
    )
  );
});

/**
 * Submit importation request
 * @route POST /api/v1/leads/importation
 * @access Public
 */
const submitImportationLead = catchAsync(async (req, res) => {
  const lead = await leadService.createImportationLead(req.body);

  res.status(STATUS.CREATED).json(
    successResponse(
      { leadId: lead.id },
      'Importation request submitted successfully. Our specialist will reach out shortly.'
    )
  );
});

/**
 * Submit contact message
 * @route POST /api/v1/leads/contact
 * @access Public
 */
const submitContactMessage = catchAsync(async (req, res) => {
  const message = await leadService.createContactMessage(req.body);

  res.status(STATUS.CREATED).json(
    successResponse(
      { messageId: message.id },
      'Message sent successfully. We will get back to you soon.'
    )
  );
});

/**
 * Get all leads (admin)
 * @route GET /api/v1/admin/leads
 * @access Private (Admin)
 */
const getLeads = catchAsync(async (req, res) => {
  const type = req.query.type || 'all'; // financing, importation, contact, or all
  const filters = {
    status: req.query.status,
    search: req.query.search,
  };

  const results = await leadService.getLeads(type, filters, req.pagination);

  // Calculate meta for each type
  const response = {};
  
  if (results.financing) {
    response.financing = {
      leads: results.financing.leads,
      meta: getPaginationMeta(
        results.financing.total,
        req.pagination.page,
        req.pagination.limit
      ),
    };
  }

  if (results.importation) {
    response.importation = {
      leads: results.importation.leads,
      meta: getPaginationMeta(
        results.importation.total,
        req.pagination.page,
        req.pagination.limit
      ),
    };
  }

  if (results.contact) {
    response.contact = {
      messages: results.contact.messages,
      meta: getPaginationMeta(
        results.contact.total,
        req.pagination.page,
        req.pagination.limit
      ),
    };
  }

  res.status(STATUS.OK).json(
    successResponse(response, 'Leads retrieved successfully')
  );
});

/**
 * Get single lead by ID (admin)
 * @route GET /api/v1/admin/leads/:type/:id
 * @access Private (Admin)
 */
const getLeadById = catchAsync(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.type, req.params.id);

  res.status(STATUS.OK).json(
    successResponse(lead, 'Lead retrieved successfully')
  );
});

/**
 * Update lead status (admin)
 * @route PATCH /api/v1/admin/leads/:type/:id
 * @access Private (Admin)
 */
const updateLeadStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const lead = await leadService.updateLeadStatus(
    req.params.type,
    req.params.id,
    status
  );

  res.status(STATUS.OK).json(
    successResponse(lead, 'Lead status updated successfully')
  );
});

/**
 * Delete lead (admin)
 * @route DELETE /api/v1/admin/leads/:type/:id
 * @access Private (Admin)
 */
const deleteLead = catchAsync(async (req, res) => {
  await leadService.deleteLead(req.params.type, req.params.id);

  res.status(STATUS.OK).json(
    successResponse(null, 'Lead deleted successfully')
  );
});

module.exports = {
  submitFinancingLead,
  submitImportationLead,
  submitContactMessage,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
};
