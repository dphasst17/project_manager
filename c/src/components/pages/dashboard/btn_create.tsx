const BtnCreate = ({name}:{name?:string}) => {
  return <button className="btn_create">
  <span>
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"></path>
    </svg>
    Create {name}
  </span>
</button>
}
export default BtnCreate
