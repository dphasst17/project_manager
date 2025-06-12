'use client'
import {use,useState} from "react"
import {AppContext} from "@/contexts/app"
import BtnDialog from "@/components/btn_dialog"
import BudgetDialog from "@/components/pages/project/dialog/budget"
import Progress from "@/components/ui/progress"
import BudgetEditDialog from "@/components/pages/project/dialog/budget_edit"
const BudgetOverview = ({id,projectData,setProjectData,isOpen,setIsOpen}:{id:any,projectData:any,setProjectData:any,isOpen:any,setIsOpen:any}) => {
  const {isAdmin,isManager} = use(AppContext)
  const [budgetEdit,setBudgetEdit] = useState<number[]>([])
  const handleSelectData = (id:number) => {
    const checkIdIsExist = budgetEdit.includes(id)
    if (checkIdIsExist) {
      setBudgetEdit(budgetEdit?.filter((d) => d !== id))
    }else{
      setBudgetEdit([...budgetEdit,id]) 
    }
  }
  return <div className="budget_overview col-span-3">
    <div className="w-full h-15 flex items-center justify-between my-2">
      <span className="text-xl font-semibold">Budget Overview</span>
        {isAdmin && <BtnDialog title="+ Add Expense" isOpen={isOpen.budget as boolean} openChange={() => setIsOpen({...isOpen,budget:!isOpen.budget})} 
        btnClass="text-blue-500 cursor-pointer" Component={BudgetDialog} props={{id}}/>}
        {isManager && budgetEdit.length > 0 && <BtnDialog title="Edit" isOpen={isOpen.budget as boolean} 
    openChange={() => setIsOpen({...isOpen,budget:!isOpen.budget})}
          btnClass="text-blue-500 cursor-pointer" Component={BudgetEditDialog} 
          props={{projectData:projectData,setProjectData,budgetList:budgetEdit,
          closeDialog:() => setIsOpen({...isOpen,budget:false})}}/>}
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between">
            <p className="font-semibold">Total Budget</p>
            <p className="font-semibold">$ {projectData && projectData.totalBudget}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Spent Amount</p>
            <p className="font-semibold text-red-600">$ {projectData && projectData.spentAmount}</p>
          </div>
          <div className="flex flex-wrap justify-between">
            <div className="w-full h-2 bg-zinc-800 rounded-md">
              {projectData && <Progress value={projectData.progressBudget} />}
            </div>
            <p className="font-semibold text-zinc-400 text-md">used {projectData && projectData.progressBudget}%</p>
            <p className="font-semibold text-zinc-400 text-md">${projectData && projectData.totalBudget - projectData.spentAmount} remaining</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 my-2">
          {projectData && projectData.budgets.map((d:any,index:number) => (
            <div key={index} onClick={() => handleSelectData(d.budget_id)} 
            className={`w-full h-15 shadow-md cursor-pointer bg-zinc-900 text-white ${budgetEdit.includes(d.budget_id) && "border border-solid border-blue-500"} rounded-md p-2 flex items-center justify-between`}>
              <p className="font-semibold">{d.category}</p>
              <p className="font-semibold flex flex-col items-end">
                <span className="text-zinc-400">${d.total_budget}</span>
                <span className="text-sm text-red-300">used ${d.spent_amount}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

}
export default BudgetOverview
