// Lead service - Business logic for lead operations
const { prisma } = require('../config/database');
const { AppError } = require('../middleware/error.middleware');
const { STATUS } = require('../config/constants');

/**
 * Create financing lead
 * @param {object} leadData - Lead data
 * @returns {Promise<object>} Created lead
 */
const createFinancingLead = async (leadData) => {
  // Convert numeric strings to appropriate types
  const data = {
    ...leadData,
    selectedCarId: leadData.selectedCarId ? parseInt(leadData.selectedCarId) : null,
    initialDepositBudget: leadData.initialDepositBudget 
      ? parseFloat(leadData.initialDepositBudget) 
      : null,
  };

  // Create lead
  const lead = await prisma.financingLead.create({
    data,
    include: {
      selectedCar: {
        select: {
          id: true,
          name: true,
          brand: true,
          model: true,
          year: true,
          price: true,
        },
      },
    },
  });

  return lead;
};

/**
 * Create importation lead
 * @param {object} leadData - Lead data
 * @returns {Promise<object>} Created lead
 */
const createImportationLead = async (leadData) => {
  const lead = await prisma.importationLead.create({
    data: leadData,
  });

  return lead;
};

/**
 * Create contact message
 * @param {object} messageData - Message data
 * @returns {Promise<object>} Created message
 */
const createContactMessage = async (messageData) => {
  const message = await prisma.contactMessage.create({
    data: messageData,
  });

  return message;
};

/**
 * Get all leads (admin)
 * @param {string} type - Lead type (financing, importation, contact, or all)
 * @param {object} filters - Filter parameters
 * @param {object} pagination - Pagination parameters
 * @returns {Promise<object>} Leads and total count
 */
const getLeads = async (type, filters, pagination) => {
  let results = {};

  if (type === 'financing' || type === 'all') {
    const where = {};
    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }
    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.financingLead.findMany({
        where,
        orderBy: { submissionDate: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          selectedCar: {
            select: {
              id: true,
              name: true,
              brand: true,
              model: true,
            },
          },
        },
      }),
      prisma.financingLead.count({ where }),
    ]);

    results.financing = { leads, total };
  }

  if (type === 'importation' || type === 'all') {
    const where = {};
    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.importationLead.findMany({
        where,
        orderBy: { submissionDate: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.importationLead.count({ where }),
    ]);

    results.importation = { leads, total };
  }

  if (type === 'contact' || type === 'all') {
    const where = {};
    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { subject: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    results.contact = { messages, total };
  }

  return results;
};

/**
 * Get single lead by ID
 * @param {string} type - Lead type (financing, importation, contact)
 * @param {number} id - Lead ID
 * @returns {Promise<object>} Lead details
 */
const getLeadById = async (type, id) => {
  let lead;

  switch (type) {
    case 'financing':
      lead = await prisma.financingLead.findUnique({
        where: { id: parseInt(id) },
        include: {
          selectedCar: true,
        },
      });
      break;
    case 'importation':
      lead = await prisma.importationLead.findUnique({
        where: { id: parseInt(id) },
      });
      break;
    case 'contact':
      lead = await prisma.contactMessage.findUnique({
        where: { id: parseInt(id) },
      });
      break;
    default:
      throw new AppError('Invalid lead type', STATUS.BAD_REQUEST);
  }

  if (!lead) {
    throw new AppError('Lead not found', STATUS.NOT_FOUND);
  }

  return lead;
};

/**
 * Update lead status
 * @param {string} type - Lead type
 * @param {number} id - Lead ID
 * @param {string} status - New status
 * @returns {Promise<object>} Updated lead
 */
const updateLeadStatus = async (type, id, status) => {
  let lead;

  switch (type) {
    case 'financing':
      lead = await prisma.financingLead.update({
        where: { id: parseInt(id) },
        data: { status },
      });
      break;
    case 'importation':
      lead = await prisma.importationLead.update({
        where: { id: parseInt(id) },
        data: { status },
      });
      break;
    case 'contact':
      lead = await prisma.contactMessage.update({
        where: { id: parseInt(id) },
        data: { status },
      });
      break;
    default:
      throw new AppError('Invalid lead type', STATUS.BAD_REQUEST);
  }

  return lead;
};

/**
 * Delete lead
 * @param {string} type - Lead type
 * @param {number} id - Lead ID
 * @returns {Promise<void>}
 */
const deleteLead = async (type, id) => {
  switch (type) {
    case 'financing':
      await prisma.financingLead.delete({
        where: { id: parseInt(id) },
      });
      break;
    case 'importation':
      await prisma.importationLead.delete({
        where: { id: parseInt(id) },
      });
      break;
    case 'contact':
      await prisma.contactMessage.delete({
        where: { id: parseInt(id) },
      });
      break;
    default:
      throw new AppError('Invalid lead type', STATUS.BAD_REQUEST);
  }
};

module.exports = {
  createFinancingLead,
  createImportationLead,
  createContactMessage,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
};
