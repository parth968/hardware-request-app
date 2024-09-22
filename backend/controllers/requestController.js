const Request = require('../models/requestModel');
const Hardware = require('../models/hardwareModel');

// Create a new request (already implemented)
exports.createRequest = async (req, res) => {
    try {
        const { hardwareId, description, duration, endDate } = req.body;

        const newRequest = new Request({
            employeeId: req.user.id, // Assuming user ID is in req.user
            hardwareId,
            description,
            duration,
            endDate,
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all requests for a particular user
exports.getUserRequests = async (req, res) => {
    try {
        // Find requests where employeeId matches the logged-in user's ID
        const userRequests = await Request.find({ employeeId: req.user.id }).populate('hardwareId');

        if (!userRequests || userRequests.length === 0) {
            return res.status(404).json({ message: 'No requests found for this user' });
        }

        res.status(200).json(userRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all requests (already implemented)
exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate('employeeId hardwareId');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a request (already implemented)
exports.updateRequest = async (req, res) => {
    try {
        const { status } = req.body; // For example, changing the status
        const request = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a request (already implemented)
exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign hardware to a request (already implemented)
exports.assignHardware = async (req, res) => {
    try {
        const { requestId, qrCode } = req.body;

        // Find the hardware associated with the QR code
        const hardware = await Hardware.findOne({ qrCode });
        if (!hardware) {
            return res.status(404).json({ message: 'Hardware not found for the given QR code' });
        }

        // Find the request
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Update the request to assign the hardware
        request.status = 'accepted';
        request.hardwareId = hardware._id; // Assigning hardware
        await request.save();

        // Update hardware availability (mark as unavailable)
        hardware.available = false;
        await hardware.save();

        res.status(200).json({ message: 'Hardware assigned successfully', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Detach hardware from a user (New feature)
exports.detachHardware = async (req, res) => {
    try {
        const { requestId, qrCode } = req.body;

        // Find the hardware associated with the QR code
        const hardware = await Hardware.findOne({ qrCode });
        if (!hardware) {
            return res.status(404).json({ message: 'Hardware not found for the given QR code' });
        }

       
        // Find the request
        const request = await Request.findById(requestId).populate('hardwareId');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

      
        // Ensure the hardware matches the one assigned to the request
        if (hardware._id.toString() !== request.hardwareId._id.toString()) {
            return res.status(400).json({ message: 'This hardware is not assigned to the request' });
        }

        // Detach the hardware from the user
        request.status = 'detached';
        await request.save();

        // Update hardware availability (mark as available)
        hardware.available = true;
        await hardware.save();



        res.status(200).json({ message: 'Hardware detached successfully', request });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ message: error.message });
    }
};

// Fetch all hardware options
exports.getHardwareOptions = async (req, res) => {
    try {
      const hardwareItems = await Hardware.find({ available: true }); // Fetch only available hardware
      res.status(200).json(hardwareItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };