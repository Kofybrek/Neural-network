#include <array>
#include <chrono>
#include <random>
#include <SFML/Graphics.hpp>

#include "Headers/Global.hpp"
#include "Headers/BackPropagation.hpp"
#include "Headers/DrawNeuralNetwork.hpp"
#include "Headers/DrawText.hpp"
#include "Headers/ForwardPropagation.hpp"

//It's 11 PM and I'm writing these comments instead of sleeping.
//What's wrong with me?
int main()
{
	bool train = 0;

	float total_error = 0;

	std::chrono::microseconds lag(0);

	std::chrono::steady_clock::time_point previous_time;

	std::mt19937_64 random_engine(std::chrono::system_clock::now().time_since_epoch().count());

	//The distribution includes the min value and excludes the max value.
	//So I'm using nextafter.
	//Call me crazy.
	std::uniform_real_distribution<float> value_distribution(VALUE_MIN, std::nextafter(VALUE_MAX, 1 + VALUE_MAX));

	vector_2d errors;
	vector_2d inputs;
	vector_2d neural_network(2 + HIDDEN_NEURONS.size());
	neural_network[0].resize(INPUT_NEURONS + BIAS_NEURONS[0], 0);
	neural_network[neural_network.size() - 1].resize(OUTPUT_NEURONS, 0);

	vector_2d target_outputs;

	vector_3d weights(neural_network.size() - 1);

	sf::Event event;

	//In order to draw pixels on the screen, I need to make 3 objects.
	//SFML is weird sometimes.
	sf::Image outputs_image;
	outputs_image.create(OUTPUTS_WIDTH, OUTPUTS_HEIGHT);

	sf::RenderWindow window(sf::VideoMode(2 * SCREEN_RESIZE * SCREEN_WIDTH, SCREEN_RESIZE * SCREEN_HEIGHT), "Neural networks", sf::Style::Close);
	window.setView(sf::View(sf::FloatRect(0, 0, 2 * SCREEN_WIDTH, SCREEN_HEIGHT)));

	sf::Sprite outputs_sprite;

	sf::Texture font_texture;
	font_texture.loadFromFile("Resources/Images/Font.png");

	sf::Texture outputs_texture;
	outputs_texture.loadFromImage(outputs_image);

	outputs_sprite.setPosition(SCREEN_WIDTH, 0);
	outputs_sprite.setScale(SCREEN_WIDTH / OUTPUTS_WIDTH, SCREEN_HEIGHT / OUTPUTS_HEIGHT);
	outputs_sprite.setTexture(outputs_texture);

	for (unsigned a = 1; a < neural_network.size() - 1; a++)
	{
		neural_network[a].resize(BIAS_NEURONS[a] + HIDDEN_NEURONS[a - 1], 0);
	}

	for (unsigned char a = 0; a < weights.size(); a++)
	{
		unsigned size = neural_network[1 + a].size();

		if (a < weights.size() - 1)
		{
			size -= BIAS_NEURONS[1 + a];
		}

		weights[a].resize(size, vector_1d(neural_network[a].size()));

		for (unsigned b = 0; b < weights[a].size(); b++)
		{
			for (unsigned c = 0; c < weights[a][b].size(); c++)
			{
				//a - layer index.
				//b - neuron in layer a.
				//c - neuron in layer a - 1.
				//weights[a][b][c] - the weight of the connection from neuron c to neuron b.
				weights[a][b][c] = value_distribution(random_engine);
			}
		}
	}

	errors.resize(weights.size());

	for (unsigned char a = 0; a < errors.size(); a++)
	{
		errors[a].resize(weights[a].size(), 0);
	}

	//Oh yeah, we're also gonna use rand().
	srand(std::chrono::system_clock::now().time_since_epoch().count());

	previous_time = std::chrono::steady_clock::now();

	while (1 == window.isOpen())
	{
		std::chrono::microseconds delta_time = std::chrono::duration_cast<std::chrono::microseconds>(std::chrono::steady_clock::now() - previous_time);

		lag += delta_time;

		previous_time += delta_time;

		while (FRAME_DURATION <= lag)
		{
			lag -= FRAME_DURATION;

			while (1 == window.pollEvent(event))
			{
				switch (event.type)
				{
					case sf::Event::Closed:
					{
						window.close();

						break;
					}
					case sf::Event::KeyReleased:
					{
						switch (event.key.code)
						{
							case sf::Keyboard::Enter:
							{
								//We start training when we press Enter.
								train = 1;
							}
						}

						break;
					}
					case sf::Event::MouseButtonPressed:
					{
						switch (event.mouseButton.button)
						{
							case sf::Mouse::Left:
							{
								int mouse_x = sf::Mouse::getPosition(window).x;
								int mouse_y = sf::Mouse::getPosition(window).y;

								if (mouse_x >= SCREEN_RESIZE * SCREEN_WIDTH && mouse_x < window.getSize().x)
								{
									if (0 <= mouse_y && mouse_y < window.getSize().y)
									{
										float dot_x = (mouse_x - SCREEN_RESIZE * SCREEN_WIDTH) / static_cast<float>(SCREEN_RESIZE * SCREEN_WIDTH);
										float dot_y = mouse_y / static_cast<float>(SCREEN_RESIZE * SCREEN_HEIGHT);

										if (sf::Keyboard::isKeyPressed(sf::Keyboard::E))
										{
											inputs.push_back({dot_x, dot_y});
											//{red, green, blue}
											target_outputs.push_back({0, 0, 1});
										}
										else if (sf::Keyboard::isKeyPressed(sf::Keyboard::Q))
										{
											inputs.push_back({dot_x, dot_y});
											target_outputs.push_back({1, 0, 0});
										}
										else if (sf::Keyboard::isKeyPressed(sf::Keyboard::W))
										{
											inputs.push_back({dot_x, dot_y});
											target_outputs.push_back({0, 1, 0});
										}
									}
								}
							}
						}
					}
				}
			}

			if (1 == train)
			{
				total_error = 0;

				for (unsigned short a = 0; a < TRAININGS_PER_FRAME; a++)
				{
					//We select inputs randomly so that we don't give priority to inputs that are at the beginning of the inputs vector.
					unsigned input_index = rand() % inputs.size();

					forward_propagation(1, inputs[input_index], neural_network, weights);
					back_propagation(target_outputs[input_index], errors, neural_network, weights);
				}

				for (unsigned a = 0; a < inputs.size(); a++)
				{
					vector_1d outputs = forward_propagation(0, inputs[a], neural_network, weights);

					for (unsigned b = 0; b < outputs.size(); b++)
					{
						total_error += abs(outputs[b] - target_outputs[a][b]);
					}
				}
			}

			if (FRAME_DURATION > lag)
			{
				sf::CircleShape dot_shape(0.5f * SCREEN_WIDTH / OUTPUTS_WIDTH);
				dot_shape.setOrigin(dot_shape.getRadius(), dot_shape.getRadius());
				dot_shape.setOutlineColor(sf::Color(0, 0, 0));
				dot_shape.setOutlineThickness(-LINE_THICKNESS);

				window.clear();

				draw_neural_network(window, font_texture, neural_network, weights);

				for (unsigned short a = 0; a < OUTPUTS_WIDTH; a++)
				{
					for (unsigned short b = 0; b < OUTPUTS_HEIGHT; b++)
					{
						float input_1 = a / static_cast<float>(OUTPUTS_WIDTH);
						float input_2 = b / static_cast<float>(OUTPUTS_HEIGHT);

						vector_1d output_color = forward_propagation(0, {input_1, input_2}, neural_network, weights);

						outputs_image.setPixel(a, b, sf::Color(round(255 * output_color[0]), round(255 * output_color[1]), round(255 * output_color[2])));
					}
				}

				outputs_texture.update(outputs_image);

				window.draw(outputs_sprite);

				for (unsigned a = 0; a < inputs.size(); a++)
				{
					dot_shape.setFillColor(sf::Color(round(255 * target_outputs[a][0]), round(255 * target_outputs[a][1]), round(255 * target_outputs[a][2])));
					dot_shape.setPosition(SCREEN_WIDTH * (1 + inputs[a][0]), SCREEN_HEIGHT * inputs[a][1]);

					window.draw(dot_shape);
				}

				draw_text(0, 0, 8, 8, "Total error: " + std::to_string(total_error), sf::Color(255, 255, 255), window, font_texture);

				window.display();
			}
		}
	}
}