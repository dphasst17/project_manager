import React from 'react';

const CardUser = ({name,role,isChecked,click}:{name:string,role:string,isChecked:boolean,click?:() => void}) => {
  return (
    <div onClick={click} className="flex flex-col gap-2 text-[10px] sm:text-xs z-50">
      <div className="px-[10px] cursor-pointer flex items-center justify-center w-full h-14 rounded-lg bg-[#232531]">
        <div className="w-full grid grid-cols-11 gap-2">
          <div className='col-span-9'>
            <p className="text-white">{name}</p>
            <p className="text-gray-500">{role}</p>
          </div>
          {isChecked &&<div className="col-span-2 flex justify-center text-[#2b9875] bg-white/5 backdrop-blur-xl p-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default CardUser;

