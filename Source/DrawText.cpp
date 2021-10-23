#include <SFML/Graphics.hpp>

#include "Headers/DrawText.hpp"

void draw_text(bool i_horizontal_center, bool i_vertical_center, short i_x, short i_y, const std::string& i_text, const sf::Color& i_color, sf::RenderWindow& i_window, const sf::Texture& i_font_texture)
{
	short character_x = i_x;
	short character_y = i_y;

	unsigned char character_height = i_font_texture.getSize().y;
	unsigned char character_width = i_font_texture.getSize().x / 96;

	sf::Sprite character_sprite(i_font_texture);

	character_sprite.setColor(i_color);

	if (1 == i_horizontal_center)
	{
		character_x -= round(0.5f * character_width * i_text.substr(0, i_text.find_first_of('\n')).size());
	}

	if (1 == i_vertical_center)
	{
		character_y -= round(0.5f * character_height * (1 + std::count(i_text.begin(), i_text.end(), '\n')));
	}

	for (std::string::const_iterator a = i_text.begin(); a != i_text.end(); a++)
	{
		if ('\n' == *a)
		{
			if (1 == i_horizontal_center)
			{
				character_x = i_x - round(0.5f * character_width * i_text.substr(0, i_text.find_first_of('\n')).size());
			}
			else
			{
				character_x = i_x;
			}

			character_y += character_height;

			continue;
		}

		character_sprite.setPosition(character_x, character_y);
		character_sprite.setTextureRect(sf::IntRect(character_width * (*a - 32), 0, character_width, character_height));

		character_x += character_width;

		i_window.draw(character_sprite);
	}
}