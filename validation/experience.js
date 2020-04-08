const validator = require('validator')

const isEmpty = require('./isEmpty')

module.exports = validateExperience = data => {
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.company = !isEmpty(data.company) ? data.company : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  if (validator.isEmpty(data.title)) {
    errors.title = 'Title is required'
  }

  if (validator.isEmpty(data.company)) {
    errors.company = 'Company field is required'
  }

  if (validator.isEmpty(data.location)) {
    errors.location = 'Company field is required'
  }

  if (validator.isEmpty(data.from)) {
    errors.from = 'From field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}