
class PocketMod
{
	constructor()
	{
		this.parentClass = "pocketmod";
		this.classPrefix = "pm-";
	}

	apply( contents )
	{
		let final = false;
		let page = 1;

		contents.classList.add( "pocketmod" );

		const protected_classes = [ "1","2","3","4","5","6","7","8","81","23","45","67" ];

		for ( let i = 0; i < contents.children.length; i++ )
		{
			let ch = contents.children[i];
			if ( !ch.classList )
				continue;

			// Clear off any leftover protected class names
			for ( let j of protected_classes )
				ch.classList.remove( this.classPrefix + "page-" + j );

			if ( ch.classList.contains(this.classPrefix + "page") || ch.classList.contains(this.classPrefix + "doublepage") )
			{
				if ( page > 8 || ( page == 8 && final ) )
				{
					throw "A PocketMod can contain at most 8 pages.";
				}
			}
			else
			{
				continue;
			}

			if ( ch.classList.contains(this.classPrefix + "page") )
			{
				// Single page
				ch.classList.add( this.classPrefix + "page-" + page );
				page++;
			}
			else if ( ch.classList.contains(this.classPrefix + "doublepage") )
			{
				// Double page

				if ( page == 1 )
				{
					// Cover sheet
					ch.classList.add( this.classPrefix + "page-81" );
					page++;
					final = true;
				}
				else if ( page == 2 || page == 4 || page == 6 )
				{
					// Centerfold
					ch.classList.add( this.classPrefix + "page-" + page + (page+1) );
					page += 2;
				}
				else
				{
					throw "Double pages can only occur on page 2/3, 4/5, 6/7";
				}
			}
		}
	}
}
