export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-8 w-8 bg-blue-300 text-center"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="h-8 w-8 bg-green-500 flex justify-center items-center">
          <Content
            style={{
              width: "75%",
              height: "75%",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block h-8 w-8 text-gray-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "center",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return (
    <div onClick={flip} className={className} style={{ backgroundColor: '#9fb5fc',borderRadius: '12px',width: '80px',height: '80px'}}>
      
    </div>
  );
}

function Front({ className, children }) {
  return <div className={className} style={{borderRadius: '12px',width: '80px',height: '80px',color: '#fff',backgroundColor: '#5f66f0',fontSize: '7px'}}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className} style={{borderRadius: '12px',width: '80px',height: '80px',color: '#c3d3fe'}}>{children}</div>;
}
