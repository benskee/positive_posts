import React from 'react'

const UserCard = props => {
    const { user } = props
  return (
    <div className="col-4">
        <div className='card mb-4 border border-0 border-info border-bottom border-3 rounded-bottom'>
            <div className="card-header text-white bg-info">{user.username}</div>
            <div className="card-body border-info border-start border-end">{user.currentPost}</div>
        </div>
    </div>
  )
}

export default UserCard