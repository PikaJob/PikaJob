import React from 'react';
function ApplicationForm(): JSX.Element {
  return (
    <form>
      <input type='text' name='url' id='url' placeholder='url'></input>
      <input type='checkbox' name='submitted' id='submitted'></input>
      <label htmlFor='submitted'>Submitted</label>
      <button></button>
    </form>
  );
}
export default ApplicationForm;
