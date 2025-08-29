import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: true
    },
    guestName: {
        type: String,
        required: [true, 'Please enter guest name'],
        maxLength: [50, 'Guest name cannot exceed 50 characters']
    },
    guestEmail: {
        type: String,
        required: [true, 'Please enter guest email'],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    checkIn: {
        type: Date,
        required: [true, 'Please enter check-in date']
    },
    checkOut: {
        type: Date,
        required: [true, 'Please enter check-out date'],
        validate: {
            validator: function(checkOut) {
                return checkOut > this.checkIn;
            },
            message: 'Check-out date must be after check-in date'
        }
    },
    totalNights: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'confirmed', 'cancelled', 'completed'],
            message: 'Please select valid status'
        },
        default: 'confirmed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// // Calculate total nights and amount before saving
// bookingSchema.pre('save', async function(next) {
//     if (this.isModified('checkIn') || this.isModified('checkOut')) {
//         const nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
//         this.totalNights = nights;
        
//         // Get room price and calculate total
//         const Room = mongoose.model('Room');
//         const room = await Room.findById(this.room);
//         if (room) {
//             this.totalAmount = nights * room.price;
//         }
//     }
//     next();
// });

// // Populate user and room data
// bookingSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'user',
//         select: 'name email'
//     }).populate({
//         path: 'room',
//         select: 'number type price'
//     });
//     next();
// });

// Index for better query performance
bookingSchema.index({ user: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model('Booking', bookingSchema);