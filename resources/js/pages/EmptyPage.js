import React from 'react';

const EmptyPage = ({ title='Empty Page', subtitle='This is empty page' }) => {

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>{ title }</h5>
          <p>{ subtitle }</p>
        </div>
      </div>
    </div>
  );
}

export default EmptyPage;
