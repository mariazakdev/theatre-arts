import React from 'react';
import './UploadFormRules.scss';

function UploadFormRules({ onAgree, isAgreed }) {
  return (
    <div className='rules'>
      <h4>Rules for disqualification:</h4>
      <ul>
        <li>Political, religious, racial, linguistic, cultural, national, or sexually oriented videos intended to hurt sentiments, traumatize, or adversely sensationalize the individual or group will be removed immediately, and the individual barred from continuing further in the competition.</li>
        <li>Falsified votes tried by any individual or group will be subject to immediate disqualification.</li>
        <li>All winners in this competition are determined through public voting, and the organizers have no hand or influence in this.</li>
      </ul>
      <div className="agree-checkbox">
        <label>
          <input type="checkbox" checked={isAgreed} onChange={onAgree} />
          I agree
        </label>
      </div>
    </div>
  );
}

export default UploadFormRules;
