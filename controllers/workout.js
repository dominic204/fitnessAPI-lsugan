const Workout = require("../models/Workout");
const User = require('../models/User');

const { verify } = require('../auth');


module.exports.addWorkout = (req, res) => {

		return Workout.findOne({ name: req.body.name }).then(existingWorkout => {

			let newWorkout = new Workout({
				userId : req.user.id,
				name : req.body.name,
				duration : req.body.duration
			});

			if(existingWorkout) {
				return res.status(409).send({ error : 'Workout already exists' });
			}
			return newWorkout.save().then(savedWorkout => res.status(201).send(savedWorkout)).catch(saveError => {

				console.error('Error in saving the workout: ', saveError);

				res.status(500).send({ error : 'Failed to save the workout' });
			});

		}).catch(findErr => {

			console.error('Error in adding the workout: ', findErr);

			return res.status(500).send({ message: "Error in adding the workout" });
		})
}

module.exports.getAllWorkouts = (req, res) => {

  return Workout.find({userId : req.user.id})
    .then((workouts) => {
      if (workouts.length > 0) {
        return res.status(200).send({ workouts });
      } else {
        return res.status(200).send({ message: "No workouts found." });
      }
    })
    .catch((findErr) => {
      console.error("Error in finding all workout: ", findErr);
      return res.status(500).send({ error: "Failed in finding workout." });
    });
};

module.exports.updateWorkout = (req, res) => {

	 const workoutId = req.params.workoutId;

	 Workout.findOne({ _id: workoutId}).then((workout) => {
	 	if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }

      	 if (workout.userId !== req.user.id) {
        return res
          .status(403)
          .send({ message: "User not authorized" });
      }

      let updatedWorkout = {
   	  name: req.body.name,
      duration: req.body.duration
	  };

	  return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout , { new: true})
	    .then((workout) => {
	      if (workout) {
	        res.status(200).send({ message: "Workout updated successfully", updatedWorkout: workout });
	      } else {
	        res.status(404).send(false);
	      }
	    })
	    .catch((err) => res.status(500).send(err));

	 })
  
};

module.exports.deleteWorkout = (req, res) => {

 const workoutId = req.params.workoutId;

	 Workout.findOne({ _id: workoutId}).then((workout) => {
	 	if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }
      	 if (workout.userId !== req.user.id) {
        return res
          .status(403)
          .send({ message: "User not authorized" });
      }

		return Workout.deleteOne({_id : workoutId}).then((deleted) => {
			if(deleted) {
				res.status(200).send({ message : "Workout deleted successfully"});
			} else {
				res.status(500).send("Deleting workout failed");
			}
		})
		  .catch((findErr) => {
	      console.error("Error to deleting workout: ", findErr);
	      return res.status(500).send({ error: "Failed to delete workout." });
	    });

  	})
};

module.exports.completeWorkout = (req, res) => {

const workoutId = req.params.workoutId;

	 Workout.findOne({ _id: workoutId}).then((workout) => {
	 	if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }

      	 if (workout.userId !== req.user.id) {
        return res
          .status(403)
          .send({ message: "User not authorized" });
      }


  let completeWorkoutStatus = {
    status: "completed",
  };
  
  return Workout.findByIdAndUpdate(workoutId, completeWorkoutStatus, { new: true})
    .then((workout) => {
      if (workout) {
        res.status(200).send({
          message: `Workout status updated successfully`,
          updatedWorkout: workout,
        });
      } else {
        res.status(404).send({ error: `Workout not found` });
      }
    })
    .catch((findErr) => {
      console.error("Error to complete workout: ", findErr);
      return res.status(500).send({ error: "Failed to complete workout." });
    });

	})
};