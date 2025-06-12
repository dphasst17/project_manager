import {AlertDialog,AlertDialogTrigger} from "./ui/alert-dialog"

const BtnDialog = ({title,isOpen,openChange,btnClass,Component,props}:
{title:string,isOpen:boolean,btnClass:string,openChange:(isOpen:boolean) => void,Component:React.ElementType,props?:any}) => {
  return <AlertDialog open={isOpen} onOpenChange={openChange}>
    <AlertDialogTrigger asChild>
      <button className={`${btnClass}`}>{title}</button>
    </AlertDialogTrigger>
    <Component {...props} closeDialog={openChange}/>
  </AlertDialog>
}
export default BtnDialog
