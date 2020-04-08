const validator = require('validator')

const isEmpty = require('./isEmpty')

module.exports = validateEducation = data => {
  let errors = {}

  data.school = !isEmpty(data.school) ? data.school : ''
  data.degree = !isEmpty(data.degree) ? data.degree : ''
  data.major = !isEmpty(data.major) ? data.major : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  if (validator.isEmpty(data.school)) {
    errors.school = 'School is required'
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required'
  }

  if (validator.isEmpty(data.major)) {
    errors.major = 'Major field is required'
  }

  if (validator.isEmpty(data.from)) {
    errors.from = 'From field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}