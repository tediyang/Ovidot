function ActionButton({text, onClick, className}) {
  return (
    <button onClick={onclick} className={`${className} inline-block bg-primary mx-auto border-none hover:cursor-pointer`}>{text} </button>
  )
}

export default ActionButton