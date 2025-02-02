export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-5 m-10">
      <p className="text-title">title</p>
      <p className="text-headline_1">headline 1</p>
      <p className="text-headline_2">headline 2</p>
      <p className="text-headline_3">headline 3</p>
      <p className="text-detail_1">detail 1</p>
      <p className="text-detail_2">detail 2</p>
      <p className="text-detail_3">detail 3</p>
      <p className="text-bold_detail">bold_detail</p>

      <button className="btn blue-btn long-btn">Button</button>
      <button className="btn white-btn long-btn">Button</button>
      <button className="btn red-btn long-btn">Button</button>
      
      <button className="btn blue-btn short-btn">Button</button>
      <button className="btn lightblue-btn short-btn">Button</button>
      <button className="btn white-btn short-btn">Button</button>
      <button className="btn red-btn short-btn">Button</button>

      <input
          id="title"
          type="text"
          placeholder="ค้นหา"
          className="input"
      />

      <form>
        <label htmlFor="title" className="text-bold_detail">
          ชื่อบทความ
        </label>
        <input
          id="title"
          type="text"
          placeholder="รายละเอียด"
          className="input"
        />
      </form>
    </div>
  );
}
