import { AlertDialogContent, AlertDialogFooter, AlertDialogTitle,AlertDialogCancel,AlertDialogAction } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { updateProject } from "@/api/project"
import {toast} from "react-toastify"

const BudgetEditDialog = ({projectData,setProjectData,budgetList,closeDialog}:
{projectData:any,setProjectData:any,budgetList:number[],closeDialog:() => void}) => {
  const [data,setData] = useState<any>(null)
  useEffect(() => {
    projectData && setData(projectData.budgets)
  },[projectData])
  const handleChangeBudget = (id:number,newValue:number) => {
    setData(
      data.map((d:any) => ({
        ...d,
        spent_amount: d.budget_id === id ? newValue : d.spent_amount
      }))
    )
  }
  const handleUpdateBudget = async() => {
    const newBudget = data.map((d:any) => ({budget_id:d.budget_id,spent_amount:d.spent_amount}))
    const currentBudget = projectData.budgets.map((d:any) => ({budget_id:d.budget_id,spent_amount:d.spent_amount}))
    const checkBudgetChange = newBudget.some((d:any) => d.spent_amount !== currentBudget.find((f:any) => f.budget_id === d.budget_id).spent_amount)
    const getColChange = newBudget.filter((d:any) => d.spent_amount !== currentBudget.find((f:any) => f.budget_id === d.budget_id).spent_amount)
    if(!checkBudgetChange) return
    const condition={
      name:"budget_id",
      method:"=" as '=',
      value:getColChange.flatMap((d:any) => d.budget_id)
    }
    const valueUpdate = getColChange.map((d:any) => ({spent_amount:d.spent_amount}))
    const res = await updateProject('budgets',valueUpdate,condition)
    if(res.status !== 200) return toast.error("Failed to update budget")
    toast.success("Success to update budget")
    setProjectData({
      ...projectData,
      budgets: projectData.budgets.map((d:any) => ({
        ...d,
        spent_amount: newBudget.find((f:any) => f.budget_id === d.budget_id).spent_amount
      }))
    }) 
    handleClose()
  }
  const handleClose = () => {
    setData(null)
    closeDialog()
  }
  return <AlertDialogContent>
    <AlertDialogTitle>Update Budget In Project</AlertDialogTitle>
    <div className="w-[500px]">
      <div className="w-full">
        {
          data && data
          .filter((d:any) => budgetList.includes(d.budget_id))
          .map((d:any,i:number) => 
            <div key={`budget-${d.budget_id}-${i}`} className="w-full grid grid-cols-3 gap-2 my-2">
              <div className="flex items-center">{d.category}</div>
              <p className="flex items-center">{d.total_budget}</p>
              <Input type="number" max={d.total_budget} onBlur={(e) => {
                  const newValue = Math.max(Number(e.target.value), projectData.budgets.find((f:any) => f.budget_id === d.budget_id).spent_amount);
                  e.target.value = newValue.toString();
                  handleChangeBudget(d.budget_id, newValue);
                }}  
                className="w-full" defaultValue={d.spent_amount} />
            </div>
          )
        }
      </div>
    </div> 
  <AlertDialogFooter>
      <AlertDialogAction onClick={(e) => {e.preventDefault();handleUpdateBudget()}} className="bg-blue-600 cursor-pointer">Save</AlertDialogAction>
      <AlertDialogCancel onClick={(e) => {e.preventDefault();handleClose()}} className="bg-red-600 cursor-pointer border-none">Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default BudgetEditDialog
