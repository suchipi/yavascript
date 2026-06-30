type Props = { title: string };

const App = (props: Props) => <div className="app">{(() => { throw new Error("tsx-boom") })()}</div>;

App({ title: "hi" });
