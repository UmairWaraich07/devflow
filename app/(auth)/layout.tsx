import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-auth-light dark:bg-auth-dark bg-center bg-cover">
      {children}
    </main>
  );
};

export default Layout;
