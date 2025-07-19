function ActionButton({text, action, classBtn}) {
  return (
    <button onClick={action} className={`${classBtn} bg-white text-[#3F404A] border-[#4D0B5E] hover:bg-[#4d0B5E] hover:text-white w-[9rem] text-sm px-4 py-2 rounded-lg inline-block transition-colors duration-300 ease-in hover:cursor-pointer`}>{text}</button>
  )
}

export default ActionButton;
