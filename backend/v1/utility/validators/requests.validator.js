const Joi = require('joi');
const { Role, userStatus, timeShare } = require('../../enums.js');
const cycleParser = require('../helpers/cycle.parsers.js');


class Validator {
  /**
   * Validate Registration Route input 
   */
  Signup = Joi.object({
    fname: Joi
      .string()
      .required(),
    lname: Joi
      .string()
      .required(),
    username: Joi.string()
      .pattern(/^[a-zA-Z]+$/) // Pattern to ensure username contains only alphabets
      .messages({
        'string.pattern.base': 'Username must contain only alphabetic characters.'
      }),
    phone: Joi
      .string()
      .pattern(/^\+\d+$/) // Pattern starts with country code
      .min(10)
      .max(14)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must start with a country code and contain only numbers.',
        'string.empty': 'Phone number is required.',
        'any.required': 'Phone number is required.'
      }),
    dob: Joi
      .date()
      .required(),
    email: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng', 'co'] } })
      .required()
      .messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address with a domain such as example.com or example.ng etc.',
        'any.required': 'Email is a required field.'
      }),
    period: Joi
      .number()
      .min(2)
      .max(8)
      .required(),
    password: Joi
      .string()
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$/)
      .messages({
        'string.pattern.base': 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.',
        'string.empty': 'Password is required.',
        'any.required': 'Password is required.'
      }),
  });
  
  /**
   * Validate login Route input
   */
  Login = Joi.object({
    email_or_phone: Joi
      .string()
      .required(),
    password: Joi
      .string()
      .required(),
  });

  /**
   * Validate Forget Password Route Input
   */
  ForgetPass = Joi.object({
    email: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng'] } })
      .required()
      .messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address with a domain such as example.com or example.ng etc.',
        'any.required': 'Email is a required field.'
      }),
    front_url: Joi
      .string()
      .required()
  });

  /**
   * Validate ResetPassword Route Input
   */
  ResetPass = Joi.object({
    new_password: Joi
      .string()
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$/)
      .messages({
        'string.pattern.base': 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.',
        'string.empty': 'Password is required.',
        'any.required': 'Password is required.'
      }),
    token: Joi
      .string()
      .required(),
  });

  /**
   * Validate UpdateUser Route Input
   */
  UpdateUser = Joi.object({
    fname: Joi
      .string(),
    lname: Joi
      .string(),
    dob: Joi
      .date(),  // YYYY-MM-DD
    period: Joi
      .number()
      .min(2)
      .max(8),
    username: Joi.string()
      .pattern(/^[a-zA-Z]+$/)
      .messages({
        'string.pattern.base': 'Username must contain only alphabetic characters.'
      }),
    sensitive: Joi.object({
        phone: Joi
          .string()
          .pattern(/^\+\d+$/)
          .min(10)
          .max(14)
          .messages({
            'string.pattern.base': 'Phone number must start with a country code and contain only numbers.'
          }),
        new_password: Joi
          .string()
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$/)
          .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.'
          }),
      }),
    password: Joi
      .string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$/)
      .messages({
        'string.empty': 'Password is required.',
        'any.required': 'Password is required.'
      }),
  })
  .custom((value, helpers) => {
    if(Object.values(value).length === 0) {
      return helpers.error('Provide atleast one field to update');
    }
    const { sensitive, password } = value;
    if(sensitive && !password) {
      return helpers.error('Password is required for updating sensitive fields (phone and password)');
    }
    return value;
  });

  /**
   * Validate CreateCycle Route Input
   */
  CreateCycle = Joi.object({
    period: Joi
      .number()
      .min(2)
      .max(8),
    startdate: Joi
      .date() // YYYY-MM-DD
      .required(),
    ovulation: Joi
      .date() // YYYY-MM-DD
  });

  /**
   * Validate GetCycles Route Input
   */
  GetCycles = Joi.object({
    month: Joi
      .alternatives()
      .try(
        Joi.number()
          .integer()
          .min(1)
          .max(12)
          .custom((value, helpers) => {
            // Check if the number is between 1 and 12
            if (value < 1 || value > 12) {
              return helpers.message('Month must be between 1 and 12');
            }
            return cycleParser.MONTHS[value];
          }),
        Joi.string()
          .valid(...Object.values(cycleParser.MONTHS))
          .custom((value, helpers) => {
            // Capitalize first letter and lower case the rest
            const formattedMonth = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            if (!cycleParser.MONTHS.includes(formattedMonth)) {
              return helpers.message('Invalid month name');
            }
            return formattedMonth;
          })
      ),
    year: Joi
      .number()
      .integer()
      .min(1970)
      .max(2100)
      .required()
      .custom((value, helpers) => {
        if (isNaN(value)) {
          return helpers.message('Year must be a valid number');
        }
        return value;
      }),
    period: Joi
      .number()
      .min(2)
      .max(8),
  });

  /**
   * Validate UpdateCycle Route Input
   */
  UpdateCycle = Joi.object({
    period: Joi
      .number()
      .min(2)
      .max(8),
    ovulation: Joi
      .date() // YYYY-MM-DD
  })
  .custom((value, helpers) => {
    if(Object.values(value).length === 0) {
      return helpers.error('Provide atleast one field to update');
    }
    return value;
  });
  
  /**
   * Admin Route: Login
   */
  AdminLogin = Joi.object({
    email_or_username: Joi
      .string()
      .required(),
    password: Joi
      .string()
      .required(),
  });
  
  /**
   * Admin Route: Get user
   */
  GetUser = Joi.object({
    email: Joi
      .string()
      .required()
  });

  /**
   * Admin Route: Get users
   */
  GetUsers = Joi.object({
    count: Joi
      .boolean()
      .default(false),
    fname: Joi
      .string(),
    lname: Joi
      .string(),
    username: Joi
      .string(),
    dob: Joi
      .date(),
    role: Joi
      .string()
      .valid(...Object.values(Role)),
    status: Joi
      .string()
      .valid(...Object.values(userStatus)),
    period: Joi
      .number()
      .min(2)
      .max(8),
    createdAt: Joi
      .object({
        range: Joi
          .object({
            time_share: Joi
              .string()
              .valid(...Object.keys(timeShare))
              .default(Object.keys(timeShare)[0]),
            times: Joi
              .number()
              .integer()
              .default(1),
          }),
        exact_range: Joi // "2023-05-30_2023-05-31"
          .string()
          .custom((value, helpers) => {
            if(value && value.split('_').length > 2) {
              return helpers.error('exact_range.invalid_length');
            }
            return value;
          }),
      })
      .custom((value, helpers) => {
        const { range, exact_range } = value;
        if(exact_range && range) {
          return helpers.error('range_and_exact_range.conflict');
        }
        return value;
      })
      .messages({
        'exact_range.invalid_length': 'You must provide not more than two dates for exact_range',
        'range_and_exact_range.conflict': 'You cannot set both range and exact_range',
      }),
    page: Joi
      .number()
      .integer()
      .default(1),
    size: Joi
      .number()
      .integer()
      .default(20),
  });

  /**
   * Admin Route: Get user cycles
   */
  GetUserCycles = [
    Joi.object({
      email: Joi
        .string()
        .email()
        .required()}),
    Joi.object({
      month: Joi
        .alternatives()
        .try(
          Joi.number()
            .integer()
            .min(1)
            .max(12)
            .custom((value, helpers) => {
              // Check if the number is between 1 and 12
              if (value < 1 || value > 12) {
                return helpers.message('Month must be between 1 and 12');
              }
              return cycleParser.MONTHS[value];
            }),
          Joi.string()
            .custom((value, helpers) => {
              // Capitalize first letter and lower case the rest
              const formattedMonth = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
              if (!Object.values(cycleParser.MONTHS).includes(formattedMonth)) {
                return helpers.message('Invalid month name');
              }
              return formattedMonth;
            })
        ),
      year: Joi
        .string(),
      period: Joi
        .number()
        .min(2)
        .max(8),
      count: Joi
        .boolean()
        .default(false),
      createdAt: Joi
        .object({
          range: Joi
            .object({
              time_share: Joi
                .string()
                .valid(...Object.keys(timeShare))
                .default(Object.keys(timeShare)[0]),
              times: Joi
                .number()
                .integer()
                .default(1),
            }),
          exact_range: Joi // "2023-05-30_2023-05-31"
            .string()
            .custom((value, helpers) => {
              if(value && value.split('_').length > 2) {
                return helpers.error('exact_range.invalid_length');
              }
              return value;
            }),
        })
        .custom((value, helpers) => {
          const { range, exact_range } = value;
          if(exact_range && range) {
            return helpers.error('range_and_exact_range.conflict');
          }
          return value;
        })
        .messages({
          'exact_range.invalid_length': 'You must provide not more than two dates for exact_range',
          'range_and_exact_range.conflict': 'You cannot set both range and exact_range',
        }),
      page: Joi
        .number()
        .integer()
        .default(1),
      size: Joi
        .number()
        .integer()
        .default(20),
    })
  ];

  /**
   * Admin Route: Update User Email
   */
  AdminUpdateUser = Joi.object({
    oldEmail: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng'] } })
      .required()
      .messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address with a domain such as example.com or example.ng etc.',
        'any.required': 'Email is a required field.'
      }),
    newEmail: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng'] } })
      .required()
      .messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address with a domain such as example.com or example.ng etc.',
        'any.required': 'Email is a required field.'
      }),
  });

  /**
   * Admin Route: Delete User
   */
  AdminDeleteUser = Joi.object({
    email: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng'] } })
      .required()
      .messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address with a domain such as example.com or example.ng etc.',
        'any.required': 'Email is a required field.'
      }),
  });

  /**
   * Admin Route: Get Cycles
   */
  AdminGetCycles = Joi.object({
    count: Joi
      .boolean()
      .default(false),
    month: Joi
      .alternatives()
      .try(
        Joi.number()
          .integer()
          .min(1)
          .max(12)
          .custom((value, helpers) => {
            // Check if the number is between 1 and 12
            if (value < 1 || value > 12) {
              return helpers.message('Month must be between 1 and 12');
            }
            return cycleParser.MONTHS[value];
          }),
        Joi.string()
          .custom((value, helpers) => {
            // Capitalize first letter and lower case the rest
            const formattedMonth = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            if (!Object.values(cycleParser.MONTHS).includes(formattedMonth)) {
              return helpers.message('Invalid month name');
            }
            return formattedMonth;
          })
      ),
    year: Joi
      .string(),
    period: Joi
      .number()
      .min(2)
      .max(8),
    start_date: Joi
      .date(),
    ovulation: Joi
      .date(),
    days: Joi
      .number()
      .min(18)
      .max(38),
    page: Joi
      .number()
      .integer()
      .default(1),
    size: Joi
      .number()
      .integer()
      .default(20),
    });

  /**
   * Admin Route: Switch Role
   */
  SwitchRole = Joi.object({
    email_username_id: Joi
      .string()
      .required(),
    role: Joi
      .string()
      .valid(...Object.values(Role))
      .required()
    });

  /**
   * Admin Route: Deactivate
   */
  DeactivateAdmin = Joi.object({
    email_username_id: Joi
      .string()
      .required(),
    });

  /**
   * Generates a new date based on the given time share and number of times.
   * This basically means the admin either wants to return the last 1 (default) or more hours, minutes of the data.
   *
   * @param {timeShare} time_share - The time share to be used for calculation (default: Time_share.hour).
   * @param {number} times - The number of times to multiply the time share by (default: 1).
   */
  last_times(time_share=timeShare.hour, times=1) {
    try {
      const now = new Date();
      const time = time_share * times;
      return new Date(now.getTime() - time);

    } catch (error) {
      throw error;
    }
  }
}

const requestValidator = new Validator();
module.exports = requestValidator;
