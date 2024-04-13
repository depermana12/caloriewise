class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.querySelector("#limit").value = this._calorieLimit;
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._renderUi();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._renderUi();
  }

  removeMeal(id) {
    this._removeItem(id, this._meals);
  }

  removeWorkout(id) {
    this._removeItem(id, this._workouts);
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._renderUi();
  }

  setLimit(limit) {
    this._calorieLimit = limit;
    Storage.setCalorieLimit(limit);
    this._displayCaloriesLimit();
    this._renderUi();
  }

  loadMealsAndWorkouts() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  _displayCaloriesTotal() {
    const totalCaloriesElement = document.querySelector("#calories-total");
    totalCaloriesElement.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const totalCalorieLimitElement = document.querySelector("#calories-limit");
    totalCalorieLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedElement =
      document.querySelector("#calories-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    caloriesConsumedElement.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedElement = document.querySelector("#calories-burned");
    const Burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );

    caloriesBurnedElement.innerHTML = Burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingElement = document.querySelector(
      "#calories-remaining"
    );
    const caloriesProgressElement = document.querySelector("#calorie-progress");
    const remaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingElement.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      caloriesProgressElement.classList.remove("bg-success");
      caloriesProgressElement.classList.add("bg-danger");
    } else {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        "bg-light"
      );
      caloriesProgressElement.classList.remove("bg-danger");
      caloriesProgressElement.classList.add("bg-success");
    }
  }

  _displayCaloriesProgress() {
    const caloriesProgressElement = document.querySelector("#calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const progress = Math.min(percentage, 100);

    caloriesProgressElement.style.width = `${progress}%`;
  }

  _displayNewMeal(meal) {
    console.log(meal);
    const mealsElement = document.querySelector("#meal-items");
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("card", "my-2");
    mealDiv.setAttribute("data-id", meal.id);
    mealDiv.innerHTML = `
    <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;
    mealsElement.appendChild(mealDiv);
  }

  _displayNewWorkout(workout) {
    console.log(workout);
    const mworkoutElement = document.querySelector("#workout-items");
    const workoutDiv = document.createElement("div");
    workoutDiv.classList.add("card", "my-2");
    workoutDiv.setAttribute("data-id", workout.id);
    workoutDiv.innerHTML = `
    <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;
    mworkoutElement.appendChild(workoutDiv);
  }

  _removeItem(id, itemsArray) {
    const index = itemsArray.findIndex((item) => item.id === id);
    if (index !== -1) {
      const item = itemsArray[index];
      if (itemsArray === this._meals) {
        this._totalCalories -= item.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.removeMeal(id);
      } else if (itemsArray === this._workouts) {
        this._totalCalories += item.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.removeWorkout(id);
      }
      itemsArray.splice(index, 1);
      this._renderUi();
    }
  }

  _renderUi() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

// const tracker = new CalorieTracker();

// const breakfast = new Meal("Breakfast", 400);
// tracker.addMeal(breakfast);

// const lunch = new Meal("lunch", 400);
// tracker.addMeal(lunch);

// const gym = new Workout("cardio", 400);
// tracker.addWorkout(gym);

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });

    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });

    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }

  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadMealsAndWorkouts();
  }

  _loadEventListeners() {
    document
      .querySelector("#meal-form")
      .addEventListener("submit", this._newMeal.bind(this));

    document
      .querySelector("#workout-form")
      .addEventListener("submit", this._newWorkout.bind(this));

    document
      .querySelector("#meal-items")
      .addEventListener("click", this._removeItems.bind(this, "meal"));

    document
      .querySelector("#workout-items")
      .addEventListener("click", this._removeItems.bind(this, "workout"));

    document
      .querySelector("#filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));

    document
      .querySelector("#filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .querySelector("#reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .querySelector("#limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newMeal(e) {
    e.preventDefault();

    const name = document.querySelector("#meal-name");
    const calories = document.querySelector("#meal-calories");

    // input validation
    if (name.value === "" || calories.value === "") {
      alert("field cannot be empty");
      return;
    }

    const meal = new Meal(name.value, +calories.value);
    this._tracker.addMeal(meal);

    name.value = "";
    calories.value = "";

    const collapseMealForm = document.querySelector("#collapse-meal");
    const collapse = new bootstrap.Collapse(collapseMealForm, {
      toggle: true,
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    const name = document.querySelector("#workout-name");
    const calories = document.querySelector("#workout-calories");

    // input validation
    if (name.value === "" || calories.value === "") {
      alert("field cannot be empty");
      return;
    }

    const workout = new Workout(name.value, +calories.value);
    this._tracker.addWorkout(workout);

    name.value = "";
    calories.value = "";

    const collapseWorkoutForm = document.querySelector("#collapse-workout");
    const collapse = new bootstrap.Collapse(collapseWorkoutForm, {
      toggle: true,
    });
  }

  _removeItems(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure? ")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const textInput = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(textInput) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.querySelector("#meal-items").innerHTML = "";
    document.querySelector("#workout-items").innerHTML = "";
    document.querySelector("#filter-meals").value = "";
    document.querySelector("#filter-workouts").value = "";
  }
  _setLimit(e) {
    e.preventDefault();
    const limit = document.querySelector("#limit");

    if (limit.value === "") {
      alert("Please add a limit");
      return;
    }
    this._tracker.setLimit(+limit.value);
    limit.value = "";

    const closeModal = document.querySelector("#limit-modal");
    const modal = bootstrap.Modal.getInstance(closeModal);
    modal.hide();
  }
}

const app = new App();
