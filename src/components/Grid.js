import { useStore } from "../store";

const Tile = ({ data, id }) => {
  const { setSVG } = useStore((state) => state);

  const svg = (svg) => <div dangerouslySetInnerHTML={{ __html: svg }} />;

  return (
    <div
      className="h-20 w-20 p-1 bg-yellow-200 hover:opacity-50"
      onClick={() => setSVG(data)}
      key={id}
    >
      {svg(data)}
    </div>
  );
};

const Grid = ({ sprites }) => {
  return (
    <div className="flex flex-wrap content-start gap-1">
      {sprites.map((data, i) => (
        <>
          <Tile data={data.svg} key={i} id={i} name={data.name} />
        </>
      ))}
    </div>
  );
};

export default Grid;
