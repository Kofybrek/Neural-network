#include <array>
#include <chrono>
#include <vector>

#include "Headers/ActivationFunction.hpp"
#include "Headers/Global.hpp"
#include "Headers/ForwardPropagation.hpp"

vector_1d forward_propagation(bool i_update, const vector_1d& i_inputs, vector_2d& i_neural_network, const vector_3d& i_weights)
{
	//When we visualize the outputs, we use a lot of forward propagation.
	//And during that time, I don't wanna change the neural network.
	//Because I also wanna draw the neural network.
	//So I came up with this.
	if (1 == i_update)
	{
		for (unsigned a = 0; a < i_neural_network[0].size(); a++)
		{
			if (a >= BIAS_NEURONS[0])
			{
				i_neural_network[0][a] = i_inputs[a - BIAS_NEURONS[0]];
			}
			else
			{
				//Bias neurons' values are always 1.
				i_neural_network[0][a] = 1;
			}
		}

		for (unsigned char a = 0; a < i_weights.size(); a++)
		{
			unsigned bias_neurons = 0;

			if (a < i_weights.size() - 1)
			{
				bias_neurons = BIAS_NEURONS[1 + a];
			}

			//At the beginning we assume that each neuron is a bias neuron.
			std::fill(i_neural_network[1 + a].begin(), i_neural_network[1 + a].end(), 1);

			for (unsigned b = 0; b < i_weights[a].size(); b++)
			{
				i_neural_network[1 + a][b + bias_neurons] = 0;

				for (unsigned c = 0; c < i_weights[a][b].size(); c++)
				{
					i_neural_network[1 + a][b + bias_neurons] += i_neural_network[a][c] * i_weights[a][b][c];
				}

				i_neural_network[1 + a][b + bias_neurons] = activation_function(0, i_neural_network[1 + a][b + bias_neurons]);
			}
		}

		return i_neural_network[i_neural_network.size() - 1];
	}
	else
	{
		//Yes, I know this is super inefficient.
		//Yes, I know there are better ways of doing this.
		//Yes, I'm sorry you had to see this.
		vector_2d neural_network = i_neural_network;

		for (unsigned a = 0; a < neural_network[0].size(); a++)
		{
			if (a >= BIAS_NEURONS[0])
			{
				neural_network[0][a] = i_inputs[a - BIAS_NEURONS[0]];
			}
			else
			{
				neural_network[0][a] = 1;
			}
		}

		for (unsigned char a = 0; a < i_weights.size(); a++)
		{
			unsigned bias_neurons = 0;

			if (a < i_weights.size() - 1)
			{
				bias_neurons = BIAS_NEURONS[1 + a];
			}

			std::fill(neural_network[1 + a].begin(), neural_network[1 + a].end(), 1);

			for (unsigned b = 0; b < i_weights[a].size(); b++)
			{
				neural_network[1 + a][b + bias_neurons] = 0;

				for (unsigned c = 0; c < i_weights[a][b].size(); c++)
				{
					neural_network[1 + a][b + bias_neurons] += neural_network[a][c] * i_weights[a][b][c];
				}

				neural_network[1 + a][b + bias_neurons] = activation_function(0, neural_network[1 + a][b + bias_neurons]);
			}
		}

		return neural_network[neural_network.size() - 1];
	}
}