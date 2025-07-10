function Dashboard() {
    return(
        <div className="col-span-2 bg-[#FEF5E3] p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#89AE29] ">HISTORY</h2>
            
            {/* Statistics Section */}
            <div className="bg-[#FEF5E3] p-4 rounded-lg shadow-md flex flex-col justify-between">
            <div className="space-y-4">
                <div className="bg-green-100 p-4 rounded shadow text-center font-semibold text-green-800">GAIN</div>
                <div className="bg-red-100 p-4 rounded shadow text-center font-semibold text-red-800">LOSS</div>
            </div>
            </div>
        </div>
    );
}
export default Dashboard