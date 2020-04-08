import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const InputGroup = ({
  name,
  value,
  placeholder,
  error,
  onChange,
  type,
  icon
}) => {
  return (
    <div className="input-group mb-3">
      <div className='input-group-prepend'>
        <span className='input-group-text'>
          <i className={icon} />
        </span>
      </div>
      <input
        placeholder={placeholder}
        type={type}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && (<div classnames="valid-feedback">{error}</div>)}
    </div>
  )
}

InputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  error: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

InputGroup.defaultProps = {
  type: 'text'
}

export default InputGroup

