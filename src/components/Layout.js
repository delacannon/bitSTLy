function Layout({ children }) {
  return (
    <div className="w-full select-none font-body overflow-hidden">
      <div className="w-full flex items-center h-screen ">{children}</div>
    </div>
  );
}

export default Layout;
