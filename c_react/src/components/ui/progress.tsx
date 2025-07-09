const Progress = (p:{value:number}) => {
  return (
    <>
      <style>
        {`
          @keyframes grow-${p.value} {
            from { width: 0%; }
            to { width: ${p.value.toString()}% }
          }
        `}
      </style>
      <div
        style={{
          width: `${p.value}%`,
          animation: `grow-${p.value} 0.7s ease-out forwards`,
          transition: 'width 0.7s ease-out',
        }}
        className="h-full bg-gradient-to-r from-green-400 to-blue-600 rounded-md"
      />
    </>
  );
};

export default Progress;

