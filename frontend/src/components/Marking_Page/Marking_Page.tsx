import FileUpload from "./view";
import { CanvasProvider } from "./canvas";
import { Divider } from "@mui/material";

function Marking() {
  return (
    <>
      <div className="TaskHeaderContent" style={{ marginTop: "50px" }}>
        <h1 className="header">Marking</h1>
      </div>
      <Divider />
      <br />
      <br />
      <CanvasProvider>
        <FileUpload />
      </CanvasProvider>
    </>
  );
}

export default Marking;
