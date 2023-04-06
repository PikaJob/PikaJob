import React, { ChangeEvent, MouseEvent } from 'react';
type ApplicationFormProps = {
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  applied: boolean;
  setApplied: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
};

function ApplicationForm(props: ApplicationFormProps): JSX.Element {
  // ------------------- INTIALIZE STATE & EXTRACT PROPS -----------------------
  const { setUrl, url, applied, setApplied, setSubmitted } = props;

  // ------------------------- HANDLE CLICK METHODS ----------------------------

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newUrl: string = event.target.value;
    setUrl(newUrl);
  };

  const handleAppliedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newApplied: boolean = event.target.checked;
    setApplied(newApplied);
  };

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('form submit button event:', event);
    // added exclamation point at end to tell Typescript the selector will never be null
    // When I used to hover over input, it would give 'Element | null'
    // now hovering only shows 'Element'
    const input = document.querySelector('#url')!;
    // HTMLInputElement has value property so TypeScript is no longer giving an error (versus Element, which does NOT have value prop)
    // https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
    (input as HTMLInputElement).value = '';
    setSubmitted(true);
  };

  // ---------------------------- RENDER COMPONENT -----------------------------
  return (
    <div
      id='addApplicationForm'
      className='flex flex-col items-center bg-babyBlue border-2 w-full p-10 font-mono space-y-10 rounded-3xl'
    >
      <h2 className='font-bold text-3xl'> Application Form </h2>
      <form className='flex flex-col bg-babyBlue w-3/5 font-mono space-y-2 text-lg font-bold'>
        <label htmlFor='jobPost'>Job Post:</label>
        <input
          id='url'
          className='w-full p-1'
          type='url'
          name='url'
          placeholder='Enter Job Url'
          onChange={handleUrlChange}
        ></input>
        <span className='space-x-5'>
          <input
            type='checkbox'
            name='applied'
            id='applied'
            onChange={handleAppliedChange}
            checked={applied}
          ></input>
          <label htmlFor='applied'>Applied</label>
        </span>
        {/* <div id='checkboxAndSubmit'> */}
        {/* <span> */}

        {/* </span> */}

        <button
          className='self-center transition ease-in-out delay-150 bg-salmon hover:scale-110 duration-300 text-white p-2 px-5 cursor-pointer rounded-full '
          type='submit'
          onClick={handleSubmit}
          disabled={url.length === 0}
        >
          Submit
        </button>
        {/* </div> */}
      </form>
    </div>
  );
}
export default ApplicationForm;
