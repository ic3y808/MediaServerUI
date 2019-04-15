using System.Linq;
using NUnit.Framework;
using Xamarin.UITest;
using Xamarin.UITest.Queries;

namespace Tests
{
	[TestFixture(Platform.Android)]
	public class Tests
	{
		private IApp app;
		private readonly Platform platform;
		private AppRect windowRect;

		public Tests(Platform platform)
		{
			this.platform = platform;
		}

		[SetUp]
		public void BeforeEachTest()
		{
			app = AppInitializer.StartApp(platform);
			windowRect = app.Query().FirstOrDefault()?.Rect;
		}

		private void OpenMenu()
		{
			app.DragCoordinates(windowRect.X, windowRect.CenterY, windowRect.Width, windowRect.CenterY);
			AppResult[] navView = app.WaitForElement(c => c.Id("nav_view"));
			Assert.IsTrue(navView.Any());
		}


		private void SelectMenuItem(string item)
		{
			OpenMenu();
			app.Screenshot("Main Menu - Selecting " + item);

			AppResult[] mainMenu = app.WaitForElement(c => c.Marked("main_menu_list"));
			Assert.IsTrue(mainMenu.Any());
			var children = app.Query(q => q.Id("main_menu_list").Child());
			foreach (var element in children)
			{
				if (string.IsNullOrEmpty(element?.Text)) continue;
				if (!element.Text.Equals(item)) continue;
				app.TapCoordinates(element.Rect.CenterX, element.Rect.CenterY);
				break;
			}
		}

		private void SelectTab(string tabName)
		{
			AppResult[] mainTabs = app.WaitForElement(c => c.Marked("nav_label"));
			Assert.IsTrue(mainTabs.Any());

			foreach (var element in mainTabs)
			{
				if (!element.Text.Equals(tabName)) continue;
				app.TapCoordinates(element.Rect.CenterX, element.Rect.CenterY);
				break;
			}
		}

		private void CheckItemsLoaded(string view, string item)
		{
			AppResult[] view1 = app.WaitForElement(c => c.Id(view));
			Assert.IsTrue(view1.Any());
			app.Screenshot(item + " loaded");
			AppResult[] view2 = app.WaitForElement(c => c.Id(item));
			Assert.IsTrue(view2.Any());
			var result = app.Query(q => q.Id(view).Child()).Length;
			Assert.IsTrue(result > 0);
			app.Screenshot(item + " items loaded count " + result);
		}

		private void SelectTrack(string view)
		{
			AppResult[] mainTabs = app.WaitForElement(c => c.Marked(view));
			Assert.IsTrue(mainTabs.Any());
			var item = mainTabs.First();
			app.TapCoordinates(item.Rect.CenterX, item.Rect.CenterY);
		}

		private void SelectElement(string element)
		{
			AppResult[] mainTabs = app.WaitForElement(c => c.Marked(element));
			Assert.IsTrue(mainTabs.Any());
			var item = mainTabs.First();
			app.TapCoordinates(item.Rect.CenterX, item.Rect.CenterY);
		}

		private void SelectContextTrack(string view, string contextId)
		{
			AppResult[] mainTabs = app.WaitForElement(c => c.Marked(view));
			Assert.IsTrue(mainTabs.Any());
			var item = mainTabs.First();
			app.TouchAndHold("right_side_count");
			//app.TouchAndHoldCoordinates(item.Rect.CenterX, item.Rect.CenterY);
			AppResult[] view1 = app.WaitForElement(c => c.Text("Edit Tags"));
			app.Tap(view1.First().Id);
			Assert.IsTrue(view1.Any());
			var item2 = view1.First();
			app.TapCoordinates(item2.Rect.CenterX, item2.Rect.CenterY);
		}

		private void WaitForElement(string id)
		{
			AppResult[] item = app.WaitForElement(c => c.Marked(id));
			Assert.IsTrue(item.Any());
		}

		private void ReplaceTextView(string id, string text)
		{
			AppResult[] item = app.WaitForElement(c => c.Marked(id));
			Assert.IsTrue(item.Any());
			app.Tap(item.First().Id);
			app.ClearText(id);
			app.EnterText(text);
			app.DismissKeyboard();
		}

		[Test]
		public void BasicOperationTests()
		{
			app.Screenshot("Main Screen");
			//app.Repl();
			SelectMenuItem("Artists");
			//CheckItemsLoaded("artists_list", "card_layout");
			//SelectTab("Favorites");
			//CheckItemsLoaded("favorites_list", "card_layout");
			//
			//SelectTrack("favorites_list");
			//
			//SelectMenuItem("Favorites");
			//CheckItemsLoaded("favorites_list", "thumbnail");
			//
			//SelectMenuItem("All Music");
			//CheckItemsLoaded("all_music_list", "card_layout");
		}

		//[Test]
		//public void TestTagEditor()
		//{
		//	app.Screenshot("Main Screen");

		//	SelectMenuItem("Artists");

		//	CheckItemsLoaded("artists_list", "right_side_count");
		//	SelectTrack("artists_list");
		//	CheckItemsLoaded("artist_track_list", "right_side_count");
		//	SelectContextTrack("artist_track_list", "action_edit_tags");

		//	WaitForElement("tag_editor_artist");

		//	ReplaceTextView("tag_editor_genre", "Testing");

		//	SelectElement("btn_save");
		//}
	}
}
