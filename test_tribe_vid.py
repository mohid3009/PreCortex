from tribev2 import TribeModel

model = TribeModel.from_pretrained(
    "facebook/tribev2",
    device="auto"
)

events = model.get_events_dataframe(
    video_path="Wan2.2_image_to_video_00003_.mp4"
)

predictions, segments = model.predict(events)

print(predictions.shape)
print(len(segments))
print(predictions)
