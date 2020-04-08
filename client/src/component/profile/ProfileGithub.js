import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ProfileGithub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repos: []
    }
  }

  componentDidMount() {
    const { username } = this.props

    fetch(`https://api.github.com/users/${username}/repos`)
      .then(res => res.json())
      .then(data => {
        this.setState({ repos: data })
      })
      .catch(err => (err.response.data))
  }

  render() {
    const { repos } = this.state

    const repoItems = Array.isArray(repos) ? repos.map((repo, index) => (
      <div className="card card-body mb-2" key={index}>
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    )) : 'Not Found Github Username'

    return (
      <div>
        <hr />
        <h3 className="mb-4">
          <h3>Latest Github Repos</h3>
        </h3>
        {repoItems}
      </div>
    )
  }
}

ProfileGithub.defaultProps = {
  repos: []
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
}

export default ProfileGithub
