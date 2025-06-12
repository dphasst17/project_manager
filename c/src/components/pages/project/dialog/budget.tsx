import {AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle} from "@/components/ui/alert-dialog"
import BtnExcel from "@/components/pages/dashboard/btn_excel"
import { useEffect, useState } from "react"
import { ExcelReader } from "@/lib/handle"
import { Input } from "@/components/ui/input"
import {toast} from "react-toastify"
import {getToken} from "@/lib/cookie"
import {adminAppendDataProject} from "@/api/project"
const budgetKey = ["total","spent","category"]
const BudgetDialog = ({id,closeDialog}:{id:number | string,closeDialog:() => void}) => {
  const [fileBudget,setFileBudget] = useState<any>(null)
  const [budget,setBudget] = useState<any>(null)
  useEffect(() =>{
    const readFile = async () => {
      if (fileBudget) {
        const result:any = await ExcelReader(fileBudget)
        const keyFromExcel = Object.keys(result[0])
        const checkKeyIsExist = keyFromExcel.every((d:string) => budgetKey.includes(d))
        if(!checkKeyIsExist) return toast.error("Key of excel does not match")
        setBudget(result.map((d:any) => ({total:d.total,spent:d.spent,category:d.category})))
      }
    }
    readFile()
  },[fileBudget])
  const handleChangeBudget = (index:number,col:string,value:string) => {
    budget && setBudget(
      budget.map((d:any,i:number) => ({
        ...d,
        [col]:index === i ? value : d[col]
      }))
    )
  }
  const handleUploadBudget = async () => {
    const token = await getToken()
    const convertData = budget.map((d:any) => ({project_id:id,total_budget:d.total,spent_amount:d.spent,category:d.category}))
    const res = token && await adminAppendDataProject(token,{type:"budgets",value:convertData})
    if(res.status !== 201) return toast.error("Failed to upload data")
    toast.success("Success to upload data")
    handleClose()
  }
  const handleClose = () => {
    setFileBudget(null)
    setBudget(null)
    closeDialog()
  }
  return <AlertDialogContent>
    <AlertDialogTitle>Budget</AlertDialogTitle>
    <div className="w-[80vw] h-[70dvh]">
        {!fileBudget && <div className="my-2">
          <BtnExcel setFile={setFileBudget} />
        </div>}
        <div className="w-full flex flex-col">
            <div className="w-full h-8 grid grid-cols-4">
              <div>Total</div>
              <div>Amount</div>
              <div className="col-span-2">Category</div>
            </div>
            <div className="w-full overflow-y-auto grid grid-cols-4 gap-2 p-2">
              {budget && budget.map((d:any,i:number) => <div key={i} className="col-span-4 grid grid-cols-4 gap-2">
                <Input onChange={(e) => handleChangeBudget(i,"total",e.target.value)} type="number" defaultValue={d.total} className="text-white" />
                <Input onChange={(e) => handleChangeBudget(i,"spent",e.target.value)} type="number" defaultValue={d.spent} className="text-white" />
                <Input onChange={(e) => handleChangeBudget(i,"category",e.target.value)} type="text" defaultValue={d.category} className="col-span-2 text-white" />
              </div>)}
            </div>
        </div>

    </div>
    <AlertDialogFooter>
      <AlertDialogAction className="bg-blue-600 cursor-pointer" onClick={handleUploadBudget}>Add</AlertDialogAction>
      <AlertDialogCancel className="bg-red-600 cursor-pointer border-none" onClick={handleClose}>Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default BudgetDialog
