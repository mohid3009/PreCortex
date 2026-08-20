from tribev2 import TribeModel
from tribev2.plotting import PlotBrainPyvista
import matplotlib.pyplot as plt


def main():
    model = TribeModel.from_pretrained("facebook/tribev2", device="cuda")

    with open("test_input.txt", "w", encoding="utf-8") as f:
        f.write("This is a test of a student learning about photosynthesis.")

    events = model.get_events_dataframe(text_path="test_input.txt")
    predictions, segments = model.predict(events)

    print("Predictions shape:", predictions.shape)
    print(predictions)

    brain = PlotBrainPyvista(mesh="fsaverage5")

    brain.plot_timesteps(
        predictions,
        segments=segments,
        views="left"
    )

    import json
    if hasattr(predictions, "tolist"):
        matrix_list = predictions.tolist()
    else:
        matrix_list = list(predictions)
        
    with open("matrix_output.json", "w", encoding="utf-8") as f:
        json.dump(matrix_list, f, indent=4)


if __name__ == "__main__":
    main()