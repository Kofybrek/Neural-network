#pragma once

//How many digits we'll show after the decimal point.
constexpr unsigned char DECIMAL_DIGITS = 2;
constexpr unsigned char LINE_THICKNESS = 2;
constexpr unsigned char NEURON_SHAPE_RADIUS = 32;
constexpr unsigned char SCREEN_RESIZE = 1;

//The size of the outputs visualization.
constexpr unsigned short OUTPUTS_HEIGHT = 64;
constexpr unsigned short OUTPUTS_WIDTH = 64;
constexpr unsigned short SCREEN_HEIGHT = 512;
constexpr unsigned short SCREEN_WIDTH = 512;

constexpr std::chrono::microseconds FRAME_DURATION(16667);

//NN stuff

//How big the learning step is gonna be.
//A low number means: "I'll put $1 in my bank account at 2% interest, so my investment has a low risk of failure."
//A high number means "I'LL SPEND ALL MY MONEY ON GAMBLING!"
constexpr float LEARNING_RATE = 0.03125f;
//I only used these values when generating the weights. So in the beginning all the weights are in the range of -1 to 1.
constexpr float VALUE_MAX = 1;
constexpr float VALUE_MIN = -1;

constexpr unsigned INPUT_NEURONS = 2;
constexpr unsigned OUTPUT_NEURONS = 3;

constexpr unsigned short TRAININGS_PER_FRAME = 1024;

//The size of the array is the total number of hidden layers. Each element is the number of neurons in each layer.
constexpr std::array<unsigned, 2> HIDDEN_NEURONS = {3, 3};
//THE OUTPUT LAYER DOESN'T NEED YOUR PATHETIC BIAS NEURONS!
constexpr std::array<unsigned, 1 + HIDDEN_NEURONS.size()> BIAS_NEURONS = {1, 0, 0};

//I used typedef.
//I deserve a cookie.
//A BIG cookie.
typedef std::vector<float> vector_1d;
typedef std::vector<std::vector<float>> vector_2d;
typedef std::vector<std::vector<std::vector<float>>> vector_3d;