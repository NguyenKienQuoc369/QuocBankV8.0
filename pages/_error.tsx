import React from 'react'

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{padding: 40, textAlign: 'center'}}>
      <h1>Application error</h1>
      <p>{statusCode ? `Status code: ${statusCode}` : 'An unexpected error occurred.'}</p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
