#include <array>
#include <chrono>
#include <vector>

#include "Headers/ActivationFunction.hpp"
#include "Headers/Global.hpp"
#include "Headers/BackPropagation.hpp"

void back_propagation(const vector_1d& i_target_outputs, vector_2d& i_errors, const vector_2d& i_neural_network, vector_3d& i_weights)
{
	for (unsigned char a = i_neural_network.size() - 1; 0 < a; a--)
	{
		for (unsigned b = 0; b < i_neural_network[a].size(); b++)
		{
			//The bias neurons aren't connected to the neurons of the previous layer.
			//And that caused a lot of headaches.
			//But I figured it out!
			//(I think...)
			unsigned bias_neurons = 0;

			if (a == i_neural_network.size() - 1)
			{
				//I forgot to say in the video that by taking a square or a cube of the error, we can prioritize large errors over small ones.
				i_errors[a - 1][b] = pow(i_neural_network[a][b] - i_target_outputs[b], 3);
			}
			else if (b >= BIAS_NEURONS[a])
			{
				unsigned next_bias_neurons = 0;

				bias_neurons = BIAS_NEURONS[a];

				if (a < i_neural_network.size() - 2)
				{
					next_bias_neurons = BIAS_NEURONS[1 + a];
				}

				i_errors[a - 1][b - bias_neurons] = 0;

				for (unsigned c = next_bias_neurons; c < i_neural_network[1 + a].size(); c++)
				{
					i_errors[a - 1][b - bias_neurons] += i_errors[a][c - next_bias_neurons] * i_weights[a][c - next_bias_neurons][b - bias_neurons];
				}
			}

			if (b >= bias_neurons)
			{
				//We used the activation function in forward propagation, so we need to recalculate the sum of the neuron.
				float neuron_output = 0;

				for (unsigned c = 0; c < i_weights[a - 1][b - bias_neurons].size(); c++)
				{
					neuron_output += i_neural_network[a - 1][c] * i_weights[a - 1][b - bias_neurons][c];
				}

				for (unsigned c = 0; c < i_neural_network[a - 1].size(); c++)
				{
					//I have no idea what's happening here.
					//I just took this formula from the internet.
					//It worked and I was like, "Cool!"
					i_weights[a - 1][b - bias_neurons][c] -= LEARNING_RATE * i_errors[a - 1][b - bias_neurons] * i_neural_network[a - 1][c] * activation_function(1, neuron_output);
				}
			}
		}
	}
}