const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const maintenanceSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        maintenanceType: {
            type: String,
            required: true,
            enum: [
                "routine",
                "mechanical",
                "electrical",
                "computerized",
                "denting",
                "painting",
            ],
        },
        specificService: {
            type: String,
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },
        appointmentTime: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled",
        },
        vehicle: {
            make: {
                type: String,
                required: true,
            },
            model: {
                type: String,
                required: true,
            },
            year: {
                type: String,
                required: true,
            },
            registration: {
                type: String,
                required: true,
            },
        },
        customer: {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },
        technician: {
            type: String,
            default: null,
        },
        cost: {
            type: String,
            default: null,
        },
        notes: {
            type: String,
            default: "",
        },
        additionalNotes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for formatted date
maintenanceSchema.virtual("formattedDate").get(function () {
    return this.appointmentDate
        ? new Date(this.appointmentDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";
});

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

module.exports = Maintenance;
