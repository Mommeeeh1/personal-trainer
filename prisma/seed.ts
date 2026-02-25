import { PrismaClient, Difficulty, MuscleGroup, Equipment } from '@prisma/client'

const prisma = new PrismaClient()

const exercises = [
  // === CHEST ===
  {
    name: "Push-up",
    instructions: "Start in a plank position with hands shoulder-width apart. Lower your chest to the floor while keeping your body straight. Push back up to the starting position.",
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Flat Barbell Bench Press",
    instructions: "Lie on a flat bench and grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest with control. Press the bar back up to full arm extension.",
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    equipment: [Equipment.BARBELL, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Dumbbell Fly",
    instructions: "Lie on a flat bench holding dumbbells above your chest with arms slightly bent. Lower the dumbbells out to the sides in a wide arc until you feel a stretch in your chest. Bring them back together above your chest.",
    muscleGroups: [MuscleGroup.CHEST],
    equipment: [Equipment.DUMBBELLS, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Cable Crossover",
    instructions: "Stand between two cable machines with handles set at shoulder height. Step forward and bring your hands together in front of your chest in a hugging motion. Slowly return to the starting position with arms wide.",
    muscleGroups: [MuscleGroup.CHEST],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Incline Dumbbell Press",
    instructions: "Set a bench to a 30-45 degree incline and hold dumbbells at shoulder level. Press the dumbbells up until your arms are fully extended. Lower them back to shoulder level with control.",
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipment: [Equipment.DUMBBELLS, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Chest Dip",
    instructions: "Grip parallel bars and lean your torso slightly forward. Lower your body by bending your elbows until you feel a stretch in your chest. Push back up to the starting position.",
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.INTERMEDIATE,
  },

  // === BACK ===
  {
    name: "Pull-up",
    instructions: "Hang from a bar with an overhand grip slightly wider than shoulder-width. Pull yourself up until your chin clears the bar. Lower yourself back down with control.",
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipment: [Equipment.PULL_UP_BAR],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Barbell Bent-Over Row",
    instructions: "Hinge at the hips holding a barbell with an overhand grip. Pull the barbell to your lower chest while squeezing your shoulder blades together. Lower it back down with control.",
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Lat Pulldown",
    instructions: "Sit at a lat pulldown machine and grip the bar wider than shoulder-width. Pull the bar down to your upper chest while squeezing your lats. Slowly return the bar to the starting position.",
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Seated Cable Row",
    instructions: "Sit at a cable row station with feet on the platform and knees slightly bent. Pull the handle to your midsection while keeping your back straight. Slowly extend your arms back to the starting position.",
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Conventional Deadlift",
    instructions: "Stand with feet hip-width apart and grip the barbell just outside your knees. Drive through your heels and extend your hips and knees to lift the bar. Lower it back to the floor by hinging at the hips.",
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.ADVANCED,
  },
  {
    name: "Face Pull",
    instructions: "Set a cable machine to upper chest height with a rope attachment. Pull the rope toward your face, separating the ends as you pull. Squeeze your rear delts and upper back at the end position.",
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.SHOULDERS],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Dumbbell Single-Arm Row",
    instructions: "Place one knee and hand on a bench for support while holding a dumbbell in the other hand. Row the dumbbell to your hip while keeping your back flat. Lower it back down with control.",
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipment: [Equipment.DUMBBELLS, Equipment.BENCH],
    difficulty: Difficulty.BEGINNER,
  },

  // === SHOULDERS ===
  {
    name: "Overhead Press",
    instructions: "Stand with a barbell at shoulder height and grip slightly wider than shoulder-width. Press the bar overhead until your arms are fully extended. Lower it back to shoulder level with control.",
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Dumbbell Lateral Raise",
    instructions: "Stand holding dumbbells at your sides with a slight bend in your elbows. Raise the dumbbells out to the sides until your arms are parallel to the floor. Lower them back down slowly.",
    muscleGroups: [MuscleGroup.SHOULDERS],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Dumbbell Front Raise",
    instructions: "Stand holding dumbbells in front of your thighs with palms facing your body. Raise one or both dumbbells in front of you to shoulder height. Lower them back down with control.",
    muscleGroups: [MuscleGroup.SHOULDERS],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Arnold Press",
    instructions: "Sit holding dumbbells at shoulder height with palms facing you. Rotate your palms outward as you press the dumbbells overhead. Reverse the motion as you lower them back down.",
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipment: [Equipment.DUMBBELLS, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Rear Delt Fly",
    instructions: "Bend forward at the hips holding dumbbells with arms hanging down. Raise the dumbbells out to the sides, squeezing your shoulder blades together. Lower them back down slowly.",
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Barbell Shrug",
    instructions: "Stand holding a barbell with arms fully extended at your sides. Shrug your shoulders straight up toward your ears. Hold briefly at the top, then lower with control.",
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Cable Lateral Raise",
    instructions: "Stand next to a cable machine with the handle at the lowest setting. Raise your arm out to the side until parallel with the floor. Lower back down with control.",
    muscleGroups: [MuscleGroup.SHOULDERS],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.BEGINNER,
  },

  // === BICEPS ===
  {
    name: "Barbell Curl",
    instructions: "Stand holding a barbell with an underhand grip at arm's length. Curl the bar up to shoulder level by bending your elbows. Lower it back down with control, keeping your upper arms stationary.",
    muscleGroups: [MuscleGroup.BICEPS],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Dumbbell Bicep Curl",
    instructions: "Stand holding dumbbells at your sides with palms facing forward. Curl the weights up to shoulder level while keeping your elbows close to your body. Lower them back down with control.",
    muscleGroups: [MuscleGroup.BICEPS],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Hammer Curl",
    instructions: "Stand holding dumbbells at your sides with palms facing each other. Curl the weights up while maintaining the neutral grip throughout. Lower them back down slowly.",
    muscleGroups: [MuscleGroup.BICEPS, MuscleGroup.FOREARMS],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Concentration Curl",
    instructions: "Sit on a bench and brace the back of your upper arm against your inner thigh. Curl the dumbbell up toward your shoulder while keeping your upper arm stationary. Lower it back down with control.",
    muscleGroups: [MuscleGroup.BICEPS],
    equipment: [Equipment.DUMBBELLS, Equipment.BENCH],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Cable Bicep Curl",
    instructions: "Stand facing a cable machine with a straight bar attachment at the lowest setting. Curl the bar up to shoulder level while keeping your elbows pinned to your sides. Lower it back down slowly.",
    muscleGroups: [MuscleGroup.BICEPS],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Incline Dumbbell Curl",
    instructions: "Sit on an incline bench set to 45 degrees holding dumbbells with arms hanging straight down. Curl the dumbbells up to shoulder level. Lower them back down for a full stretch.",
    muscleGroups: [MuscleGroup.BICEPS],
    equipment: [Equipment.DUMBBELLS, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },

  // === TRICEPS ===
  {
    name: "Tricep Dip",
    instructions: "Grip parallel bars with arms straight and body upright. Lower yourself by bending your elbows to about 90 degrees. Push back up to the starting position.",
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Skull Crusher",
    instructions: "Lie on a bench holding a barbell or dumbbells above your chest with arms extended. Lower the weight toward your forehead by bending your elbows. Extend your arms back to the starting position.",
    muscleGroups: [MuscleGroup.TRICEPS],
    equipment: [Equipment.BARBELL, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Cable Tricep Pushdown",
    instructions: "Stand facing a cable machine with a rope or bar attachment at the highest setting. Push the handle down by extending your elbows until your arms are straight. Slowly return to the starting position.",
    muscleGroups: [MuscleGroup.TRICEPS],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Overhead Tricep Extension",
    instructions: "Stand or sit holding a dumbbell overhead with both hands. Lower the weight behind your head by bending your elbows. Extend your arms back overhead to the starting position.",
    muscleGroups: [MuscleGroup.TRICEPS],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Close-Grip Bench Press",
    instructions: "Lie on a bench and grip the barbell with hands about shoulder-width apart. Lower the bar to your chest keeping your elbows close to your body. Press the bar back up to full extension.",
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    equipment: [Equipment.BARBELL, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Diamond Push-up",
    instructions: "Get into a push-up position with your hands together forming a diamond shape. Lower your chest toward your hands while keeping elbows close to your body. Push back up to the starting position.",
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.INTERMEDIATE,
  },

  // === LEGS: QUADS ===
  {
    name: "Barbell Back Squat",
    instructions: "Place a barbell on your upper back and stand with feet shoulder-width apart. Lower your body by bending your knees and hips until your thighs are parallel to the floor. Drive through your heels to stand back up.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Bodyweight Squat",
    instructions: "Stand with feet shoulder-width apart and arms extended in front of you. Lower your body until your thighs are parallel to the floor. Push through your heels to return to standing.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Walking Lunge",
    instructions: "Stand upright and take a large step forward, lowering your back knee toward the ground. Push through your front heel to step forward into the next lunge. Alternate legs with each step.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Dumbbell Lunge",
    instructions: "Hold a dumbbell in each hand at your sides and step forward into a lunge. Lower your back knee toward the ground while keeping your front knee over your ankle. Push back to the starting position.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Leg Press",
    instructions: "Sit in the leg press machine with feet shoulder-width apart on the platform. Lower the platform by bending your knees to about 90 degrees. Press the platform back up without locking your knees.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipment: [Equipment.FULL_GYM],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Leg Extension",
    instructions: "Sit in the leg extension machine with your shins behind the pad. Extend your legs until they are straight, squeezing your quads at the top. Lower the weight back down with control.",
    muscleGroups: [MuscleGroup.QUADS],
    equipment: [Equipment.FULL_GYM],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Bulgarian Split Squat",
    instructions: "Stand about two feet in front of a bench and place one foot behind you on the bench. Lower your body by bending your front knee until your thigh is parallel to the floor. Push back up through your front heel.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipment: [Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Goblet Squat",
    instructions: "Hold a dumbbell or kettlebell at chest level with both hands. Squat down by pushing your hips back and bending your knees. Drive through your heels to stand back up.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },

  // === LEGS: HAMSTRINGS & GLUTES ===
  {
    name: "Romanian Deadlift",
    instructions: "Stand holding a barbell at hip level with a shoulder-width grip. Hinge at the hips and lower the bar along your legs while keeping your back flat. Return to standing by driving your hips forward.",
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Lying Hamstring Curl",
    instructions: "Lie face down on the hamstring curl machine with the pad behind your ankles. Curl your legs up toward your glutes by bending your knees. Lower the weight back down slowly.",
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.FULL_GYM],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Barbell Hip Thrust",
    instructions: "Sit on the floor with your upper back against a bench and a barbell across your hips. Drive through your heels to lift your hips until your body forms a straight line from shoulders to knees. Lower your hips back down with control.",
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.BARBELL, Equipment.BENCH],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Sumo Squat",
    instructions: "Stand with feet wider than shoulder-width and toes pointed outward. Lower your body by bending your knees, keeping your chest upright. Push through your heels to return to standing.",
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Dumbbell Romanian Deadlift",
    instructions: "Stand holding dumbbells in front of your thighs with a slight bend in your knees. Hinge at the hips and lower the dumbbells along your legs until you feel a hamstring stretch. Return to standing by squeezing your glutes.",
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Glute Bridge",
    instructions: "Lie on your back with knees bent and feet flat on the floor. Drive through your heels to lift your hips toward the ceiling, squeezing your glutes at the top. Lower back down with control.",
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Kettlebell Swing",
    instructions: "Stand with feet shoulder-width apart holding a kettlebell with both hands. Hinge at the hips and swing the kettlebell back between your legs. Drive your hips forward explosively to swing the kettlebell to chest height.",
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS, MuscleGroup.BACK],
    equipment: [Equipment.KETTLEBELL],
    difficulty: Difficulty.INTERMEDIATE,
  },

  // === LEGS: CALVES ===
  {
    name: "Standing Calf Raise",
    instructions: "Stand on the edge of a step or platform with your heels hanging off. Rise up onto your toes as high as possible, squeezing your calves. Lower your heels below the step for a full stretch.",
    muscleGroups: [MuscleGroup.CALVES],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Seated Calf Raise",
    instructions: "Sit at a calf raise machine with the pads on your lower thighs. Press up onto your toes, lifting the weight as high as you can. Lower your heels back down slowly for a full stretch.",
    muscleGroups: [MuscleGroup.CALVES],
    equipment: [Equipment.FULL_GYM],
    difficulty: Difficulty.BEGINNER,
  },

  // === ABS ===
  {
    name: "Plank",
    instructions: "Get into a forearm plank position with your body forming a straight line from head to heels. Engage your core and hold the position without letting your hips sag or rise. Breathe steadily throughout.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Crunch",
    instructions: "Lie on your back with knees bent and hands behind your head. Curl your upper body toward your knees by contracting your abs. Lower back down with control without fully resting your shoulders.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Hanging Leg Raise",
    instructions: "Hang from a pull-up bar with arms fully extended. Raise your legs in front of you until they are parallel to the floor. Lower them back down slowly without swinging.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.PULL_UP_BAR],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Lying Leg Raise",
    instructions: "Lie flat on your back with hands at your sides or under your lower back. Raise your legs to a vertical position while keeping them straight. Lower them back down slowly without touching the floor.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Bicycle Crunch",
    instructions: "Lie on your back with hands behind your head and legs raised. Bring one knee toward your chest while rotating your opposite elbow to meet it. Alternate sides in a pedaling motion.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Russian Twist",
    instructions: "Sit on the floor with knees bent, lean back slightly, and lift your feet off the ground. Rotate your torso from side to side, touching the floor beside your hips. Keep your core engaged throughout.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Dead Bug",
    instructions: "Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees. Slowly extend one arm behind you and the opposite leg forward. Return to the start and alternate sides.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Mountain Climber",
    instructions: "Start in a high plank position with hands under your shoulders. Drive one knee toward your chest, then quickly switch legs. Continue alternating at a rapid pace while keeping your core tight.",
    muscleGroups: [MuscleGroup.ABS, MuscleGroup.CARDIO],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Hollow Hold",
    instructions: "Lie on your back and press your lower back into the floor. Raise your legs and shoulders off the ground with arms extended overhead. Hold this position while maintaining a braced core.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Cable Woodchop",
    instructions: "Set a cable machine to the highest position and stand sideways to it. Pull the handle diagonally across your body from high to low, rotating your torso. Return to the starting position with control.",
    muscleGroups: [MuscleGroup.ABS],
    equipment: [Equipment.CABLES],
    difficulty: Difficulty.INTERMEDIATE,
  },

  // === CARDIO ===
  {
    name: "Burpee",
    instructions: "From standing, drop into a squat and place your hands on the floor. Jump your feet back into a plank, perform a push-up, then jump your feet forward. Explode upward into a jump with arms overhead.",
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.CARDIO],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "Jumping Jack",
    instructions: "Stand with feet together and arms at your sides. Jump your feet out wide while raising your arms overhead. Jump back to the starting position and repeat at a steady pace.",
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.FULL_BODY],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Jump Rope",
    instructions: "Hold the rope handles at hip height and swing the rope over your head. Jump just high enough to clear the rope as it passes under your feet. Maintain a steady rhythm with light, quick jumps.",
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.CALVES],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Box Jump",
    instructions: "Stand facing a sturdy box or platform at an appropriate height. Swing your arms and jump onto the box, landing softly with both feet. Step back down and repeat.",
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: "High Knees",
    instructions: "Stand in place and run on the spot, driving your knees up toward your chest. Pump your arms in sync with your legs. Maintain a fast pace to keep your heart rate elevated.",
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    difficulty: Difficulty.BEGINNER,
  },

  // === FOREARMS ===
  {
    name: "Wrist Curl",
    instructions: "Sit on a bench with your forearms resting on your thighs and wrists hanging over your knees. Curl the weight up by flexing your wrists. Lower it back down slowly for a full stretch.",
    muscleGroups: [MuscleGroup.FOREARMS],
    equipment: [Equipment.DUMBBELLS, Equipment.BENCH],
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: "Farmer's Walk",
    instructions: "Pick up a heavy dumbbell or kettlebell in each hand and stand tall. Walk forward with controlled steps while keeping your core braced and shoulders back. Continue for the prescribed distance or time.",
    muscleGroups: [MuscleGroup.FOREARMS, MuscleGroup.FULL_BODY],
    equipment: [Equipment.DUMBBELLS],
    difficulty: Difficulty.BEGINNER,
  },
]

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    })
  }
  console.log(`Seeded ${exercises.length} exercises`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
