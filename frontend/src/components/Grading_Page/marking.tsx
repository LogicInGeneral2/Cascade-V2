import FileUpload from "./view";
import { CanvasProvider } from "./canvas";

function Marking() {
  return (
    <>
      <CanvasProvider>
        <div style={{ backgroundColor: "#c5ac94" }}>
          <FileUpload />
        </div>
      </CanvasProvider>
    </>
  );
}

export default Marking;
