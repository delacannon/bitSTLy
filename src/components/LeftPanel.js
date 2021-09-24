import Grid from "./Grid";
import { useDropzone } from "react-dropzone";
import { BitsyParser } from "@bitsy/parser";
import { useStore } from "../store";

const InputFile = () => {
  const { setGameData } = useStore((state) => state);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop: async ([file]) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const gamedata = BitsyParser.parse(e.target.result.split("\n"));
        setGameData(gamedata);
      };
      reader.readAsText(file);
    },
  });

  return (
    <section
      className={
        isDragActive
          ? `w-full h-64 border-8 border-yellow-200 border-dashed p-2`
          : `w-full h-64 border-8 border-yellow-200 border-dashed p-2`
      }
    >
      <div
        {...getRootProps({
          className: isDragActive
            ? "w-full h-full bg-yellow-400"
            : "w-full h-full bg-yellow-200",
        })}
      >
        <input {...getInputProps()} />

        <svg
          className="fill-current w-40 h-40 m-auto text-yellow-300 animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 8 8"
        >
          <path d="M1 2h1v1H1zm2 0h1v1H3zm4 0h1v1H7zM1 3h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm4 0h1v1H7zM1 4h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm3 0h1v1H6zM1 5h1v1H1zm1 0h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zM2 6h1v1H2zm1 0h1v1H3zm1 0h1v1H4zm1 0h1v1H5zM2 7h1v1H2zm3 0h1v1H5z" />
        </svg>
        <div>
          <p className="text-yellow-500 uppercase font-body text-3xl text-center">
            {isDragActive ? <p>THANK YOU!</p> : <p>Drag me a .bitsy</p>}
          </p>
        </div>
      </div>
    </section>
  );
};

function LeftPanel() {
  const { sprites } = useStore((state) => state);

  return (
    <div className="flex-1 z-20">
      <div className="w-full flex h-screen bg-red-200 relative ">
        <div
          className="h-screen w-8 p-4 absolute -right-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23fecaca%22%20viewBox%3D%220%200%208%208%22%3E%0A%20%20%3Cpath%20d%3D%22M0%200h1v1H0zm1%200h1v1H1zm1%200h1v1H2zm1%200h1v1H3zm1%200h1v1H4zM0%201h1v1H0zm1%200h1v1H1zm1%200h1v1H2zm1%200h1v1H3zM0%202h1v1H0zm1%200h1v1H1zm1%200h1v1H2zM0%203h1v1H0zm1%200h1v1H1zM0%204h1v1H0zm1%200h1v1H1zM0%205h1v1H0zm1%200h1v1H1zm1%200h1v1H2zM0%206h1v1H0zm1%200h1v1H1zm1%200h1v1H2zm1%200h1v1H3zM0%207h1v1H0zm1%200h1v1H1zm1%200h1v1H2zm1%200h1v1H3zm1%200h1v1H4z%22%20%2F%3E%0A%3C%2Fsvg%3E")`,
            backgrondSize: "4% 4%",
          }}
        />
        {!sprites && (
          <div className="w-64 m-auto">
            <InputFile />
          </div>
        )}
        {sprites && (
          <div className="p-4 overflow-y-auto">
            <p className="font-bold mx-auto border-b-2 mb-2 text-3xl text-gray-600 uppercase">
              Sprites:
            </p>
            <Grid sprites={sprites} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftPanel;
