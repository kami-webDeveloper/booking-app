const Footer = () => {
  return (
    <div className="bg-blue-800 py-8 sm:py-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
        <span className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
          Holidays.com
        </span>

        <span className="text-white font-bold tracking-tight flex gap-4 text-sm sm:text-base">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
