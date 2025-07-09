const StatisComponent = ({title,value,Icon,bgIcon,color}:{title:string,value:string,Icon:any,bgIcon:string,color:string}) => {
  return <div className="statisItem grid grid-cols-4 gap-x-2 h-[100px] shadow-md bg-[#000] border border-zinc-700 rounded-md px-8">
      <div className="statisContent col-span-3 h-full flex flex-col justify-center items-start">
        <p className="text-md font-semibold text-zinc-400">{title}</p>
        <p className="text-4xl font-semibold text-white">{value}</p>
      </div>
      <div className="statisIcon h-full flex justify-center items-center">
        <div className={`iconItem w-4/5 h-2/4 flex justify-center items-center rounded-md ${bgIcon.toString()}`}>
          <Icon className={`w-8 h-8 ${color}`}/>
        </div>
      </div>
    </div>
}

export default StatisComponent
