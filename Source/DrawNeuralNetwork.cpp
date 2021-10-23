#include <array>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <SFML/Graphics.hpp>

#include "Headers/Global.hpp"
#include "Headers/DrawNeuralNetwork.hpp"
#include "Headers/DrawText.hpp"
#include "Headers/GetMaxElement.hpp"
#include "Headers/GetMinElement.hpp"

void draw_neural_network(sf::RenderWindow& i_window, const sf::Texture& i_font_texture, const vector_2d& i_neural_network, const vector_3d& i_weights)
{
	//When our max neuron is 9 and our min neuron is -1, I don't wanna draw them with as opposites of one another.
	//I want to have SYMMETRY!
	float max_neuron = std::max(abs(get_max_element(i_neural_network)), abs(get_min_element(i_neural_network)));
	float min_neuron = -max_neuron;

	sf::CircleShape neuron_shape(NEURON_SHAPE_RADIUS);
	neuron_shape.setOutlineColor(sf::Color(255, 255, 255));
	neuron_shape.setOutlineThickness(-LINE_THICKNESS);

	sf::VertexArray connection_shape(sf::Quads, 4);

	//When our max neuron is 3 and our min neuron is 2, I don't wanna draw the min neuron as black.
	if (0 <= get_min_element(i_neural_network))
	{
		min_neuron = 0;
	}
	
	for (unsigned char a = 0; a < i_neural_network.size(); a++)
	{
		unsigned short neuron_x = SCREEN_WIDTH * (1 + a) / (1 + i_neural_network.size());

		for (unsigned b = 0; b < i_neural_network[a].size(); b++)
		{
			//Rounding the value of the neuron to the nearest [DECIMAL_DIGITS] digits after the decimal point.
			float neuron_value = round(i_neural_network[a][b] * pow(10, DECIMAL_DIGITS)) / pow(10, DECIMAL_DIGITS);

			unsigned char neuron_color = round(255 * (i_neural_network[a][b] - min_neuron) / (max_neuron - min_neuron));
			unsigned char text_color = 255 * (128 > neuron_color);

			unsigned short neuron_y = SCREEN_HEIGHT * (1 + b) / (1 + i_neural_network[a].size());

			std::ostringstream neuron_text_stream;
			neuron_text_stream << std::fixed << std::setprecision(DECIMAL_DIGITS) << neuron_value;

			neuron_shape.setFillColor(sf::Color(neuron_color, neuron_color, neuron_color));
			neuron_shape.setPosition(neuron_x - NEURON_SHAPE_RADIUS, neuron_y - NEURON_SHAPE_RADIUS);

			if (a < i_neural_network.size() - 1)
			{
				float max_weight = std::max(abs(get_max_element(i_weights[a])), abs(get_min_element(i_weights[a])));
				float min_weight = -max_weight;

				//I have mixed feelings towards bias neurons.
				//Sometimes I hate them.
				//And sometimes I hate them.
				unsigned bias_neurons = 0;

				if (a < i_neural_network.size() - 2)
				{
					bias_neurons = BIAS_NEURONS[1 + a];
				}

				for (unsigned c = bias_neurons; c < i_neural_network[1 + a].size(); c++)
				{
					if (0 <= i_weights[a][c - bias_neurons][b])
					{
						unsigned char connection_opacity = round(255 * i_weights[a][c - bias_neurons][b] / max_weight);

						//Why can't I just say: "connection_shape.color = sf::Color(0, 255, 0, connection_opacity)"?
						connection_shape[0].color = sf::Color(0, 255, 0, connection_opacity);
						connection_shape[1].color = sf::Color(0, 255, 0, connection_opacity);
						connection_shape[2].color = sf::Color(0, 255, 0, connection_opacity);
						connection_shape[3].color = sf::Color(0, 255, 0, connection_opacity);
					}
					else
					{
						unsigned char connection_opacity = round(255 * i_weights[a][c - bias_neurons][b] / min_weight);

						connection_shape[0].color = sf::Color(255, 0, 0, connection_opacity);
						connection_shape[1].color = sf::Color(255, 0, 0, connection_opacity);
						connection_shape[2].color = sf::Color(255, 0, 0, connection_opacity);
						connection_shape[3].color = sf::Color(255, 0, 0, connection_opacity);
					}
					
					unsigned short previous_neuron_x = SCREEN_WIDTH * (2 + a) / (1 + i_neural_network.size());
					unsigned short previous_neuron_y = SCREEN_HEIGHT * (1 + c) / (1 + i_neural_network[1 + a].size());

					//I should've used rectangles.
					connection_shape[0].position = sf::Vector2f(previous_neuron_x, previous_neuron_y - 0.5f * LINE_THICKNESS);
					connection_shape[1].position = sf::Vector2f(neuron_x, neuron_y - 0.5f * LINE_THICKNESS);
					connection_shape[2].position = sf::Vector2f(neuron_x, neuron_y + 0.5f * LINE_THICKNESS);
					connection_shape[3].position = sf::Vector2f(previous_neuron_x, previous_neuron_y + 0.5f * LINE_THICKNESS);

					i_window.draw(connection_shape);
				}
			}

			i_window.draw(neuron_shape);

			draw_text(1, 1, neuron_x, neuron_y, neuron_text_stream.str(), sf::Color(text_color, text_color, text_color), i_window, i_font_texture);
		}
	}
}