import ScanRecord from "../models/ScanRecord.js";

const getTodayMissionCount = async(req, res) => {
  try{
    const childId = req.params.childId;
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await ScanRecord.countDocuments({
      childId: childId,
      scannedAt: {
        $gte: start,
        $lte: end,
      },
    });

    res.status(200).json({ count: count });
  }catch(error) {
    res.status(500).json({ error: error.message });
  }
};

export { getTodayMissionCount };