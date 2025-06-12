const CardMac = ({title,description,tag}:{title:string,description:string,tag:string[]}) => {
  return <div className="card">
  <div className="mac-header">
    <span className="red"></span>
    <span className="yellow"></span>
    <span className="green"></span>
  </div>
  <span className="card-title">{title}</span>
  {/*<p className="card-description">
    {description}    
  </p>*/}
  <div className="tags">
    {tag.map((t:string) => <span key={t} className="card-tag mr-1">{t}</span>)}
  </div>
  <div className="code-editor">
    <pre>
      <code>
        {description} 
      </code>
    </pre>
  </div>
</div>

}
export default CardMac
